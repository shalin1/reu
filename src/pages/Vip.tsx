import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'

type SubscriptionOption = {
  name: string
  priceId: string
  label: string
}
const subscriptionOptions = [
  { name: 'vip', priceId: 'price_1PSLT5J2NmcQazwF41p9fYK9', label: 'You will not be charged' },
]

const Vip = () => {
  const [selectedPriceId, setSelectedPriceId] = useState(subscriptionOptions[0].priceId)
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
      <p>Thanks for your support. Click the below to set up your access.</p>
      <form action="/api/vip" method="POST">
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

export default Vip
