import React, { ChangeEvent, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

const SearchInput: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchParams((curr) => ({ ...curr, query }))
  }

  return (
    <input
      type="text"
      className="border-2 border-solid border-black"
      value={searchParams.get('query') || ''}
      onChange={onChange}
    />
  )
}
export default SearchInput
