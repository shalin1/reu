import React from 'react'
import { Outlet } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string

const Auth0ProviderLayout = () => (
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <Outlet />
  </Auth0Provider>
)

export default Auth0ProviderLayout
