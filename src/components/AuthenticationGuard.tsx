import React from 'react'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const AuthenticationGuard = ({ component }: { component: React.ComponentType<object> }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <h1>Loading...</h1>,
  })

  return <Component />
}

export default AuthenticationGuard
