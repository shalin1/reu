import { config as dotenvconfig } from 'dotenv'
import express, { Router } from 'express'
import serverless from 'serverless-http'
import Stripe from 'stripe'

dotenvconfig()
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: 1024 * 1024 }))
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}
app.use(allowCrossDomain)
let clientDomain
app.use((req, res, next) => {
  clientDomain = req.headers.origin || process.env.CLIENT_DOMAIN
  next()
})
const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const jsonify = (request) => {
  if (Buffer.isBuffer(request.body)) {
    const parts = request.body
      .toString()
      .split('&')
      .reduce((acc, part) => {
        const [key, value] = part.split('=')
        acc[decodeURIComponent(key)] = decodeURIComponent(value)
        return acc
      }, {})
    request.body = parts
  }
}

router.get('/publishable-key', (req, res) => {
  res.json({ publishable_key: process.env.STRIPE_PUBLISHABLE_KEY })
})

router.post('/create-checkout-session', async (req, res) => {
  jsonify(req)
  const options = {
    mode: 'subscription',
    line_items: [
      {
        price: req.body.priceId,
        quantity: 1,
      },
    ],
    success_url: `${clientDomain}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientDomain}?canceled=true`,
  }
  // `{CHECKOUT_SESSION_ID}` is a string literal that is replaced by the actual
  // session ID by Stripe on success

  if (req.body.stripeCustomerId) {
    options.customer = req.body.stripeCustomerId
  }

  const session = await stripe.checkout.sessions.create(options)
  res.redirect(303, session.url)
})

router.get('/stripe-session-details/:sessionId', async (req, res) => {
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

router.get('/stripe-subscription-details/:customerId', async (req, res) => {
  const subscriptionList = await stripe.subscriptions.list({ customer: req.params.customerId })

  res.send({
    subscriptions: subscriptionList.data,
  })
})

app.use('/api/', router)

export const handler = serverless(app)
