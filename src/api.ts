import axios from 'axios'

export const getStripeSessionData = async (sessionId: string) => {
  const response = await axios.get(`/api/stripe-session-details/${sessionId}`)
  return response.data
}

export const getStripeSubscriptionStatus = async (stripeCustomerId: string) => {
  if (stripeCustomerId) {
    const response = await axios.get(`/api/stripe-subscription-details/${stripeCustomerId}`)
    return response.data
  } else {
    return {}
  }
}
