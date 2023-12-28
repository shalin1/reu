import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <button
      className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
      onClick={() => loginWithRedirect()}
    >
      Log in to continue
    </button>
  )
}

export default LoginButton
