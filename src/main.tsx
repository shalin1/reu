import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import ErrorPage from './ErrorPage'
import Auth0ProviderLayout from './components/Auth0ProviderLayout'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import './index.css'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Auth0ProviderLayout />} errorElement={<ErrorPage />}>
      <Route path="/" element={<App />} />
      <Route path="/order/checkout" element={<Checkout />} />
      <Route path="/order/success" element={<Success />} />
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
