import { useState } from 'react'
// import axios from "axios";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const [clientSecretSettings, setClientSecretSettings] = useState({
    clientSecret: '',
    loading: true,
  })

  return (
    <div>
      <h1>Checkout</h1>
      <form action="/api/create-checkout-session" method="POST">
        <input type="hidden" name="priceId" value="price_0OcWYkO0ta6i0fcmKCPElToa" />
        <button type="submit">Checkout</button>
      </form>
    </div>
  )
}

export default Checkout
