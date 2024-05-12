import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const MainMenuButton = () => {
  const { logout } = useAuth0()

  return (
    <Link to="/">
      <button className="btn-primary">Main Menu</button>
    </Link>
  )
}

export default MainMenuButton
