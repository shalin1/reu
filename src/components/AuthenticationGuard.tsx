import React from "react"
import { withAuthenticationRequired } from "@auth0/auth0-react"

const AuthenticationGuard = ({ component }: { component: React.ComponentType<object> }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div>Loading...</div>
    )
  })

  return <Component />
}

export default AuthenticationGuard
