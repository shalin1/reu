import React from 'react'

const Checkout = () => (
  <div>
    <h1>Checkout</h1>
    <form action="/api/create-checkout-session" method="POST">
      <input type="hidden" name="priceId" value="price_0OcWYkO0ta6i0fcmKCPElToa" />
      <button type="submit">Checkout</button>
    </form>
  </div>
)

export default Checkout
