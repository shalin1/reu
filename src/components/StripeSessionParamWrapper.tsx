import React from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'

const StripeSessionParamWrapper = () => {
  const [search] = useSearchParams()
  const stripeSessionParam = search.get('session_id')

  return stripeSessionParam ? <Outlet /> : <Navigate to="/" replace />
}

export default StripeSessionParamWrapper
