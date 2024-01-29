import React from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'

const StateParamWrapper = () => {
  const [search] = useSearchParams()
  const stripeSessionParam = search.get('session_id')

  return stripeSessionParam ? <Outlet /> : <Navigate to="/" replace />
}

export default StateParamWrapper
