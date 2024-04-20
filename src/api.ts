import axios from 'axios'
import Stripe from 'stripe'

export const getStripeSessionData = async (sessionId: string) => {
  const response = await axios.get(`api/stripe-session-details/${sessionId}`)
  return response.data
}

export const getHasActiveStripeSubscription = async (stripeCustomerId: string) => {
  const response = await axios.get(`api/stripe-subscription-details/${stripeCustomerId}`)
  return response.data.subscriptions.some((subscription: Stripe.Subscription) => subscription.status === 'active')
}
