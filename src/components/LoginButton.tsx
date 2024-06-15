import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  const signUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: '/profile',
      },
      authorizationParams: {
        screen_hint: 'signup',
      },
    })
  }

  return (
    <>
      <button className="btn-primary" onClick={() => loginWithRedirect()}>
        Log in
      </button>
      <button className="btn-primary" onClick={() => signUp()}>
        Sign up
      </button>
    </>
  )
}

export default LoginButton
