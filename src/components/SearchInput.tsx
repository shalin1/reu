import React, { ChangeEvent, ForwardedRef, forwardRef } from 'react'

interface Props {
  query: string
  setQuery: (query: string) => void
}

// eslint-disable-next-line react/display-name
const SearchInput: React.FC<Props & React.RefAttributes<HTMLInputElement>> = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const { query, setQuery } = props

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    }

    return (
      <input
        ref={ref} // Add the ref to the input element
        type="text"
        className="border-2 border-solid border-black"
        value={query}
        onChange={onChange}
      />
    )
  },
)

export default SearchInput
