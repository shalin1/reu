import axios from 'axios'
import Stripe from 'stripe'

const clientDomain = import.meta.env.VITE_CLIENT_DOMAIN

const apiClient = axios.create({
  baseURL: `${clientDomain}/api`
})

export const getStripeSessionData = async (sessionId: string) => {
  const response = await apiClient.get(`/stripe-session-details/${sessionId}`)
  return response.data
}

export const getHasActiveStripeSubscription = async (stripeCustomerId: string) => {
  const response = await apiClient.get(`/stripe-subscription-details/${stripeCustomerId}`)
  return response.data.subscriptions.some((subscription: Stripe.Subscription) => subscription.status === 'active')
}
