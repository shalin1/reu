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
        <tr>
          <td>VITE_AUTH0_DOMAIN</td>
          <td>{VITE_AUTH0_DOMAIN}</td>
        </tr>
        <tr>
          <td>VITE_CLIENT_DOMAIN</td>
          <td>{VITE_CLIENT_DOMAIN}</td>
        </tr>
        <tr>
          <td>VITE_DISABLE_PAYWALL</td>
          <td>{VITE_DISABLE_PAYWALL}</td>
        </tr>
        <tr>
          <td>VITE_SANITY_STUDIO_PROJECT_ID</td>
          <td>{VITE_SANITY_STUDIO_PROJECT_ID}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default Vars
