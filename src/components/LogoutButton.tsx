import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      Log Out
    </button>
  )
}

export default LogoutButton
