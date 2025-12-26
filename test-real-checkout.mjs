#!/usr/bin/env node

/**
 * End-to-end test: Creates a real Stripe checkout session
 * This creates actual persistent objects in Stripe test mode
 */

import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const testCustomerEmail = `test-${Date.now()}@example.com`
const testSanityUserId = `test-user-${Date.now()}`

console.log('🧪 Creating Real Test Checkout Session\n')
console.log('📧 Test email:', testCustomerEmail)
console.log('👤 Test Sanity user ID:', testSanityUserId)
console.log('\n🚀 Creating checkout session...\n')

try {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.VITE_STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `http://localhost:8888/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:8888/order/checkout`,
    customer_email: testCustomerEmail,
    metadata: {
      sanityUserId: testSanityUserId,
      userEmail: testCustomerEmail
    }
  })

  console.log('✅ Checkout session created!\n')
  console.log('Session ID:', session.id)
  console.log('\n🌐 Open this URL in your browser to complete the checkout:\n')
  console.log(session.url)
  console.log('\n💳 Use test card: 4242 4242 4242 4242')
  console.log('   Expiry: Any future date (e.g., 12/25)')
  console.log('   CVC: Any 3 digits (e.g., 123)\n')
  console.log('📝 After completing checkout, you should see:')
  console.log('   1. Webhook events in the stripe listener terminal')
  console.log('   2. checkout.session.completed event')
  console.log('   3. customer.subscription.created event')
  console.log('   4. invoice.paid event')
  console.log('\n⚠️  Make sure your webhook listener is running!')
  console.log('   Run: stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook\n')
} catch (error) {
  console.error('❌ Error creating checkout session:', error.message)
  process.exit(1)
}
