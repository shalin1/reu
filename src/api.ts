import axios from 'axios'
import Stripe from 'stripe'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_CLIENT_DOMAIN}/api`
})

export const getStripeSessionData = async (sessionId: string) => {
  const response = await apiClient.get(`/stripe-session-details/${sessionId}`)
  return response.data
}

export const getHasActiveStripeSubscription = async (stripeCustomerId: string) => {
  const response = await apiClient.get(`/stripe-subscription-details/${stripeCustomerId}`)
  return response.data.subscriptions.some((subscription: Stripe.Subscription) => subscription.status === 'active')
}
