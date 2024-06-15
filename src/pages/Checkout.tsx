import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'

type SubscriptionOption = {
  name: string
  priceId: string
  label: string
}
const subscriptionOptions = [{ name: 'yearly', priceId: 'price_1PRlXHJ2NmcQazwFOfSTsZ8F', label: '$125/year' }]

const Checkout = () => {
  const [selectedPriceId, setSelectedPriceId] = useState('price_0OcWYkO0ta6i0fcmYp0ifF0o')
  const [stripeCustomerId, setStripeCustomerId] = useState('')
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPriceId(event.target.value)
  }
  const { sanityUser } = useAuth0UserWithSanity()
  const optionDivClass = (option: SubscriptionOption) =>
    classNames('border-2', 'rounded-full', 'p-2', {
      'border-red-500': selectedPriceId === option.priceId,
      'border-gray-300': selectedPriceId !== option.priceId,
      'hover:border-red-300': selectedPriceId !== option.priceId,
    })
  useEffect(() => {
    if (sanityUser && sanityUser.stripeCustomerId) {
      setStripeCustomerId(sanityUser.stripeCustomerId)
    }
  }, [sanityUser])

  return (
    <div>
      <p>
        You must have an active subscription in order to use the Reunion web tool. Please choose one of the options
        below and click the Checkout button to continue to billing. You will be returned to this site after finalizing
        your order.
      </p>
      <form action="/api/create-checkout-session" method="POST">
        <div className="my-3 flex justify-center gap-5">
          {subscriptionOptions.map((option) => (
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
          ))}
        </div>
        <input type="hidden" id="stripe-customer-id" name="stripeCustomerId" value={stripeCustomerId} />
        <button type="submit" className="btn-primary">
          Checkout
        </button>
      </form>
    </div>
  )
}

export default Checkout
