import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorPage from './ErrorPage'
import Auth0ProviderLayout from './components/Auth0ProviderLayout'
import StripeSessionParamWrapper from './components/StripeSessionParamWrapper'
import AuthenticationGuard from './components/AuthenticationGuard'
import Checkout from './pages/Checkout'
import ReunionSession from './pages/ReunionSession'
import Splash from './pages/Splash'
import Success from './pages/Success'
import Vars from './pages/Vars'
import './index.css'
import VipCheckout from './pages/VipCheckout'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Auth0ProviderLayout />} errorElement={<ErrorPage />}>
      <Route path="/" element={<Splash />} />
      <Route path="/vars" element={<Vars />} />
      <Route path="/session" element={<AuthenticationGuard component={ReunionSession} />} />
      <Route path="/order/checkout" element={<AuthenticationGuard component={Checkout} />} />
      <Route path="/order/vipcheckout" element={<AuthenticationGuard component={VipCheckout} />} />
      <Route element={<StripeSessionParamWrapper />}>
        <Route path="/order/success" element={<AuthenticationGuard component={Success} />} />
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
