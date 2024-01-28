import axios from 'axios'

const getStripeSessionData = async (sessionId: string) => {
  const response = await axios.get(`/api/stripe-session-details/${sessionId}`)
  return response.data
}

export { getStripeSessionData }
