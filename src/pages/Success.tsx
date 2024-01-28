import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStripeSessionData } from '../api'
import { epochToDateString } from '../utils'

const Success = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const sessionId = searchParams.get('session_id')!

  const { isPending, error, data } = useQuery({
    queryKey: ['stripeSessions', sessionId],
    queryFn: () => getStripeSessionData(sessionId),
  })

  if (isPending) return <div>Loading...</div>

  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div>
      <h1>Success!</h1>
      <p>Your session ID is {sessionId} </p>
      <p>Subscription start date: {epochToDateString(data.subscriptionStart)}</p>
      <p>Subscription end date: {epochToDateString(data.subscriptionEnd)}</p>
      <p>Stripe customer ID: {data.customerId}</p>
      <p>Stripe customer name: {data.customerName}</p>
    </div>
  )
}

export default Success
