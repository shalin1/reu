import React from 'react'

const Checkout = () => (
  <div className="text-left">
    <p>
      You must have an active subscription in order to use the Reunion web tool. Please choose one of the two options
      below and click the Checkout button to continue to billing. You will be returned to this site after finalizing
      your order.
    </p>
    <form action="/api/create-checkout-session" method="POST">
      <input type="radio" id="monthly" name="priceId" value="price_0OcWYkO0ta6i0fcmKCPElToa" />
      <label htmlFor="monthly">$40/month</label>
      <input type="radio" id="yearly" name="priceId" value="price_0OcWYkO0ta6i0fcmYp0ifF0o" />
      <label htmlFor="yearly">$450/year</label>
      <br />
      <button type="submit" className="btn-primary">
        Checkout
      </button>
    </form>
  </div>
)

export default Checkout
