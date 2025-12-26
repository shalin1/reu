import React, { useEffect, useState } from 'react'
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
  const [linkError, setLinkError] = useState<string | null>(null)
  const [linkSuccess, setLinkSuccess] = useState(false)
  const {
    isPending,
    error,
    data: stripeData,
  } = useQuery({
    queryKey: ['stripeSessions', sessionId],
    queryFn: () => getStripeSessionData(sessionId),
    retry: 3,
    retryDelay: 1000,
  })

  useEffect(() => {
    const updateSanityUser = async () => {
      if (!sanityUser || !stripeData) return

      if (
        sanityUser.stripeCustomerId !== stripeData.customerId ||
        sanityUser.name !== stripeData.customerName
      ) {
        try {
          await sanityClient
            .patch(sanityUser._id)
            .set({ stripeCustomerId: stripeData.customerId, name: stripeData.customerName })
            .commit()

          setLinkSuccess(true)
          setLinkError(null)
        } catch (err) {
          console.error('Failed to update Sanity user:', err)
          setLinkError(
            'Your payment was successful, but we had trouble linking your account. Please contact support or try continuing to the app.'
          )
        }
      } else {
        setLinkSuccess(true)
      }
    }

    updateSanityUser()
  }, [sanityUser, stripeData])

  if (isPending) return <div>Loading your subscription details...</div>

  if (error) {
    return (
      <div>
        <h1>Payment Successful, But...</h1>
        <p className="my-3 text-red-600">
          We encountered an error retrieving your subscription details: {error.message}
        </p>
        <p className="my-3">
          Don't worry! Your payment was processed successfully. The issue is on our end linking your account.
        </p>
        <p className="my-3">
          You can either wait a few minutes for our system to sync automatically via webhooks, or contact support with
          your email address.
        </p>
        <Link to="/session" className="btn-primary">
          Try continuing to app
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Success! Congratulations on your subscription, {stripeData.customerName}!</h1>
      <p className="my-3">
        Your current subscription started {epochToDateString(stripeData.subscriptionStart)} and renews{' '}
        {epochToDateString(stripeData.subscriptionEnd)}
      </p>

      {linkError && (
        <div className="my-3 rounded border border-yellow-500 bg-yellow-50 p-4">
          <p className="text-yellow-800">{linkError}</p>
        </div>
      )}

      {linkSuccess && !linkError && (
        <div className="my-3 rounded border border-green-500 bg-green-50 p-4">
          <p className="text-green-800">✓ Your account has been successfully linked!</p>
        </div>
      )}

      <Link to="/session" className="btn-primary">
        Click to continue
      </Link>

      <p className="mt-4 text-sm text-gray-600">
        Note: If you encounter any issues accessing the app, please wait a minute and refresh the page. Our system may
        still be processing your subscription.
      </p>
    </div>
  )
}

export default Success
