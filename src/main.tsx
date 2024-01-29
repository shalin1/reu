import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorPage from './ErrorPage'
import Auth0ProviderLayout from './components/Auth0ProviderLayout'
import StripeSessionParamWrapper from './components/StripeSessionParamWrapper'
import Checkout from './pages/Checkout'
import ReunionSession from './pages/ReunionSession'
import Splash from './pages/Splash'
import Success from './pages/Success'
import './index.css'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Auth0ProviderLayout />} errorElement={<ErrorPage />}>
      <Route path="/" element={<Splash />} />
      <Route path="/session" element={<ReunionSession />} />
      <Route path="/order/checkout" element={<Checkout />} />
      <Route element={<StripeSessionParamWrapper />}>
        <Route path="/order/success" element={<Success />} />
      </Route>
    </Route>,
  ),
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
