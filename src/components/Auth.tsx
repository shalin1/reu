import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth0()

  const logButtonClass = 'bg-cyan-500 font-semibold px-4 py-2 rounded-full shadow-sm text-sm text-white'

  if (isLoading) {
    return <div></div>
  }

  return (
    <div className="text-right">
      {isAuthenticated ? <LogoutButton className={logButtonClass} /> : <LoginButton className={logButtonClass} />}
    </div>
  )
}

export default Auth
