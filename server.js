require('dotenv').config()

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const DOMAIN = 'http://localhost:5173'

// Fetch the publishable key to initialize Stripe.js
fastify.get('/publishable-key', () => {
  return { publishable_key: process.env.STRIPE_PUBLISHABLE_KEY }
})

fastify.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_0OcFXCO0ta6i0fcmMBKLsgjR',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${DOMAIN}?success=true`,
    cancel_url: `${DOMAIN}?canceled=true`,
  })

  res.redirect(303, session.url)
})

// Create a payment intent and return its client secret
fastify.post('/create-payment-intent', async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    payment_method_types: ['card'],
  })

  return { client_secret: paymentIntent.client_secret }
})

// Run the server
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
