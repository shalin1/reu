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
    </div>
  )
}

export default Checkout
