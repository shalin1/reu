import React from 'react'
import { Link } from 'react-router-dom'
import LoginButton from './LoginButton'

const Splash = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-3">
    <Link to="/">
      <img className="mx-auto" alt="egg logo" src="/src/images/egg.png" />
    </Link>
    <h1>Welcome to the ReUnion Facilitation Tools</h1>
    <LoginButton />
  </div>
)

export default Splash
