import React, { ChangeEvent, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

interface Props {
  query: string
  setQuery: (query: string) => void
}
const SearchInput: React.FC<Props> = ({ query, setQuery }) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return <input type="text" className="border-2 border-solid border-black" value={query} onChange={onChange} />
}
export default SearchInput
