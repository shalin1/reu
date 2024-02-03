import React, { useState } from 'react'
import classNames from 'classnames'

type SubscriptionOption = {
  name: string,
  priceId: string,
  label: string
}
const subscriptionOptions = [
  { name: 'monthly', priceId: 'price_0OcWYkO0ta6i0fcmKCPElToa', label: '$40/month' },
  { name: 'yearly', priceId: 'price_0OcWYkO0ta6i0fcmYp0ifF0o', label: '$450/year' }
]

const Checkout = () => {
  const [selectedPriceId, setSelectedPriceId] = useState('')
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPriceId(event.target.value)
  }
  const optionDivClass = (option: SubscriptionOption) => classNames(
    'border-2', 'rounded-full', 'p-2', {
      'border-red-500': selectedPriceId === option.priceId,
      'border-gray-300': selectedPriceId !== option.priceId,
      'hover:border-red-300': selectedPriceId !== option.priceId
    }
  )

  return (
    <div>
      <p>
        You must have an active subscription in order to use the Reunion web tool. Please choose one of the two options
        below and click the Checkout button to continue to billing. You will be returned to this site after finalizing
        your order.
      </p>
      <form action="/api/create-checkout-session" method="POST">
        <div className="flex gap-5 justify-center my-3">
          {
            subscriptionOptions.map((option) => (
              <div key={option.name} className={optionDivClass(option)}>
                <input
                  type="radio"
                  id={option.name}
                  name="priceId"
                  value={option.priceId}
                  className="sr-only"
                  onChange={handlePriceChange}
                  checked={selectedPriceId === option.priceId}
                />
                <label htmlFor={option.name}>{option.label}</label>
              </div>
            ))
          }
        </div>
        <button type="submit" className="btn-primary">
          Checkout
        </button>
      </form>
    </div>
  )
}

export default Checkout
