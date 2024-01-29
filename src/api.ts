import axios from 'axios'

export const getStripeSessionData = async (sessionId: string) => {
  const response = await axios.get(`/api/stripe-session-details/${sessionId}`)
  return response.data
}
