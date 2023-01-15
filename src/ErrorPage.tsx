import React from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorPage: React.FC = () => {
  const error = useRouteError() as { statusText?: string; message?: string }

  return (
    <div id="error-page">
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

export default ErrorPage
