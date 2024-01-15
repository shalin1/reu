import React from 'react'
import LoginButton from './LoginButton'

const Splash = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-3">
    <img className="mx-auto" alt="egg logo" src="/src/images/egg.png" />
    <h1>Welcome to the ReUnion Facilitation Tools</h1>
    <LoginButton />
  </div>
)

export default Splash
