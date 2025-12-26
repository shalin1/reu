import Stripe from 'stripe'
import { createClient } from '@sanity/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Initialize Sanity client
const sanityClient = createClient({
  apiVersion: '2023-06-16',
  dataset: 'production',
  useCdn: false,
  projectId: process.env.VITE_SANITY_STUDIO_PROJECT_ID,
  token: process.env.VITE_SANITY_STUDIO_TOKEN,
})

// Webhook signature verification
const verifyWebhookSignature = (body, signature) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return null
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return null
  }
}

// Find or create Sanity user by Stripe customer
const findOrCreateSanityUser = async (customer) => {
  // First try to find by stripeCustomerId
  let sanityUser = await sanityClient.fetch(
    `*[_type == 'user' && stripeCustomerId == $customerId][0]`,
    { customerId: customer.id }
  )

  if (sanityUser) {
    return sanityUser
  }

  // If not found and customer has email, try to find by email
  if (customer.email) {
    sanityUser = await sanityClient.fetch(
      `*[_type == 'user' && email == $email][0]`,
      { email: customer.email }
    )

    if (sanityUser) {
      // Found by email, update with stripe customer ID
      console.log(`Linking existing user ${sanityUser._id} to Stripe customer ${customer.id}`)
      await sanityClient
        .patch(sanityUser._id)
        .set({
          stripeCustomerId: customer.id,
          name: customer.name || sanityUser.name,
        })
        .commit()

      return await sanityClient.fetch(`*[_type == 'user' && _id == $id][0]`, { id: sanityUser._id })
    }
  }

  console.warn(`No Sanity user found for Stripe customer ${customer.id} (${customer.email})`)
  return null
}

// Update subscription status in Sanity
const updateSubscriptionStatus = async (subscription) => {
  const customer = await stripe.customers.retrieve(subscription.customer)
  const sanityUser = await findOrCreateSanityUser(customer)

  if (!sanityUser) {
    console.error(`Cannot update subscription - no Sanity user for customer ${customer.id}`)
    return
  }

  const updateData = {
    stripeCustomerId: customer.id,
    name: customer.name || sanityUser.name,
    subscriptionStatus: subscription.status,
    subscriptionId: subscription.id,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
  }

  console.log(`Updating Sanity user ${sanityUser._id} with subscription ${subscription.id} (${subscription.status})`)

  await sanityClient.patch(sanityUser._id).set(updateData).commit()
}

export const handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const signature = event.headers['stripe-signature']
  if (!signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing stripe-signature header' }),
    }
  }

  // Verify webhook signature
  const stripeEvent = verifyWebhookSignature(event.body, signature)
  if (!stripeEvent) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' }),
    }
  }

  console.log(`Received webhook: ${stripeEvent.type}`)

  try {
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await updateSubscriptionStatus(stripeEvent.data.object)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = stripeEvent.data.object
        const deletedCustomer = await stripe.customers.retrieve(deletedSubscription.customer)
        const deletedUser = await findOrCreateSanityUser(deletedCustomer)

        if (deletedUser) {
          console.log(`Marking subscription ${deletedSubscription.id} as deleted for user ${deletedUser._id}`)
          await sanityClient
            .patch(deletedUser._id)
            .set({
              subscriptionStatus: 'canceled',
              subscriptionId: deletedSubscription.id,
            })
            .commit()
        }
        break

      case 'invoice.paid':
        // Refresh subscription data when invoice is paid
        const paidInvoice = stripeEvent.data.object
        if (paidInvoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(paidInvoice.subscription)
          await updateSubscriptionStatus(subscription)
        }
        break

      case 'invoice.payment_failed':
        const failedInvoice = stripeEvent.data.object
        console.warn(`Payment failed for invoice ${failedInvoice.id}`)
        // Could add notification logic here
        break

      case 'checkout.session.completed':
        // Handle successful checkout
        const session = stripeEvent.data.object
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription)
          await updateSubscriptionStatus(subscription)
        }
        break

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
