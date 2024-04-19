import axios from 'axios'
import Stripe from 'stripe'

const serverUrl = import.meta.env.SERVER_URL
export const getStripeSessionData = async (sessionId: string) => {
  const response = await axios.get(`${serverUrl}/stripe-session-details/${sessionId}`)
  return response.data
}

export const getHasActiveStripeSubscription = async (stripeCustomerId: string) => {
  const response = await axios.get(`${serverUrl}/stripe-subscription-details/${stripeCustomerId}`)
  return response.data.subscriptions.some((subscription: Stripe.Subscription) => subscription.status === 'active')
}
