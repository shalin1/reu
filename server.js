require('dotenv').config()

const fastify = require('fastify')({ logger: true })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const DOMAIN = 'http://localhost:5173'

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
    success_url: `${DOMAIN}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}?canceled=true`,
  })
  // `{CHECKOUT_SESSION_ID}` is a string literal that is replaced by the actual
  // session ID by Stripe on success

  res.redirect(303, session.url)
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
