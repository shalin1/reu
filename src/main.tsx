import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App'
import ErrorPage from './ErrorPage'
import Auth0ProviderLayout from './components/Auth0ProviderLayout'
import Checkout from './pages/Checkout'
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Auth0ProviderLayout />} errorElement={<ErrorPage />}>
      <Route path="/" element={<App />}>
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Route>,
  ),
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
