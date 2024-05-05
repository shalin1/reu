import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStripeSessionData } from '../api'
import { epochToDateString } from '../utils'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'
import sanityClient from '../data/sanityClient'

const Success = () => {
  const [searchParams, _] = useSearchParams()
  const sessionId = searchParams.get('session_id')!
  const { sanityUser } = useAuth0UserWithSanity()
  const {
    isPending,
    error,
    data: stripeData,
  } = useQuery({
    queryKey: ['stripeSessions', sessionId],
    queryFn: () => getStripeSessionData(sessionId),
  })

  useEffect(() => {
    if (
      sanityUser &&
      stripeData &&
      sanityUser.stripeCustomerId !== stripeData.customerId &&
      sanityUser.name !== stripeData.customerName
    ) {
      sanityClient
        .patch(sanityUser._id)
        .set({ stripeCustomerId: stripeData.customerId, name: stripeData.customerName })
        .commit()
    }
  }, [sanityUser, stripeData])

  if (isPending) return <div>Loading...</div>

  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div>
      <h1>Success! Congratulations on your subscription, {stripeData.customerName}!</h1>
      <p className="my-3">
        Your current subscription started {epochToDateString(stripeData.subscriptionStart)} and renews{' '}
        {epochToDateString(stripeData.subscriptionEnd)}
      </p>
      <Link to="/session" className="btn-primary">Click to continue</Link>
    </div>
  )
}

export default Success
