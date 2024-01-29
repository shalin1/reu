require('dotenv').config()

const fastify = require('fastify')({ logger: true })
fastify.register(require('@fastify/formbody'))
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const domain = process.env.DOMAIN

fastify.get('/publishable-key', () => {
  return { publishable_key: process.env.STRIPE_PUBLISHABLE_KEY }
})

fastify.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: req.body.priceId,
        quantity: 1,
      },
    ],
    success_url: `${domain}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}?canceled=true`,
  })
  // `{CHECKOUT_SESSION_ID}` is a string literal that is replaced by the actual
  // session ID by Stripe on success

  res.redirect(303, session.url)
})

fastify.get('/stripe-session-details/:sessionId', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId)
  const customer = await stripe.customers.retrieve(session.customer)
  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  res.send({
    subscriptionStart: subscription.current_period_start,
    subscriptionEnd: subscription.current_period_end,
    customerId: customer.id,
    customerName: customer.name,
  })
})

fastify.get('/stripe-subscription-details/:customerId', async (req, res) => {
  const customer = await stripe.customers.retrieve(session.customer)

  res.send({
    active: Boolean(customer.subscription && customer.subscription.status === 'active'),
  })
})

const start = async () => {
  try {
    await fastify.listen({ port: 5252 })
    console.log('Server listening ... ')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
