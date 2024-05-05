import React from 'react'

const Vars = () => {
  const { VITE_AUTH0_DOMAIN, VITE_CLIENT_DOMAIN, VITE_DISABLE_PAYWALL, VITE_SANITY_STUDIO_PROJECT_ID } = import.meta.env

  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.entries({ VITE_AUTH0_DOMAIN, VITE_CLIENT_DOMAIN, VITE_DISABLE_PAYWALL, VITE_SANITY_STUDIO_PROJECT_ID }).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default Vars
