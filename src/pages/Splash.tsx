import React from 'react'
import { Link } from 'react-router-dom'
import LoginButton from '../components/LoginButton'
import LogoutButton from '../components/LogoutButton'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'

const Splash = () => {
  const { isAuthenticated, isLoading } = useAuth0UserWithSanity()

  if (isLoading) return <div>Loading...</div>

  const path = `/src/images/egg.png`
  const modules = import.meta.glob('/src/images/*', { eager: true })
  const mod = modules[path] as { default: string }
  const eggImageSrc = mod?.default

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Link to="/">
        <img className="mx-auto" alt="egg logo" src={eggImageSrc} />
      </Link>
      <h1>Welcome to the ReUnion Facilitation Tools</h1>
      {isAuthenticated ? (
        <>
          <Link to="/session" className="btn-primary">
            Start session
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
