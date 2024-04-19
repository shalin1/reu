import React from 'react'
import { Link } from 'react-router-dom'
import LoginButton from '../components/LoginButton'
import LogoutButton from '../components/LogoutButton'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'

const Splash = () => {
  const { isAuthenticated, isLoading } = useAuth0UserWithSanity()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Link to="/">
        <img className="mx-auto" alt="egg logo" src="/images/egg.png" />
      </Link>
      <h1>Welcome to the ReUnion Facilitation Tools</h1>
      {isAuthenticated ? (
        <>
          <Link to="/session" className="btn-primary">
            Continue
          </Link>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}

export default Splash
