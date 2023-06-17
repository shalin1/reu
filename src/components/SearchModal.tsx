import React, { ChangeEvent, ForwardedRef, forwardRef, useCallback, useEffect, useState } from 'react'

interface Props {
  loading: boolean

  noResults: boolean
  initialShow?: boolean
  setQuery: (internalQuery: any) => void
}

const SearchModal: React.FC<Props & React.RefAttributes<HTMLInputElement>> = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const [show, setShow] = useState(props.initialShow || false)
    useEffect(() => {
      if (props.initialShow !== undefined) {
        setShow(props.initialShow)
      }
    }, [props.initialShow])
    const [internalQuery, setInternalQuery] = useState('')
    const { setQuery, loading, noResults } = props
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInternalQuery(e.target.value)
    }
    const closeModal = (e?: React.FormEvent) => {
      e && e.preventDefault()
      setQuery(internalQuery)
      setInternalQuery('')
      setShow(false)
    }

    const closeOnEscape = useCallback(
      (e: KeyboardEvent) => {
        if (show && e.key === 'Escape') {
          closeModal()
        }
      },
      [closeModal],
    )

    useEffect(() => {
      document.addEventListener('keydown', closeOnEscape)
      return () => {
        document.removeEventListener('keydown', closeOnEscape)
      }
    }, [closeOnEscape])

    useEffect(() => {
      if (show && ref && typeof ref === 'object' && ref.current) {
        ref.current.focus()
      }
    }, [show, ref, noResults])

    useEffect(() => {
      if (noResults) {
        setShow(true)
      }
    }, [noResults])

    const keyboardHandler = useCallback(
      (e: KeyboardEvent) => {
        if (e.metaKey && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'f')) {
          e.preventDefault()
          setShow(true)
        }

        if (e.key === 'Escape') {
          e.preventDefault()
          setShow(false)
        }
      },
      [setShow],
    )

    useEffect(() => {
      document.addEventListener('keydown', keyboardHandler)
      return () => {
        document.removeEventListener('keydown', keyboardHandler)
      }
    }, [keyboardHandler])

    if (loading || !show) return null

    const placeholder = props.noResults ? 'No results found, try again.' : 'Search for file names'

    return (
      <div className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-90" onClick={closeModal}>
        <div className="mx-auto flex h-3/5 w-3/4 flex-col justify-center">
          <form onSubmit={closeModal}>
            <label htmlFor="default-search" className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="mb-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-xl text-gray-900 placeholder:text-lg focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                ref={ref}
                value={internalQuery}
                onChange={onChange}
                placeholder={placeholder}
              />
              <button
                type="submit"
                className="absolute right-2.5 bottom-2.5 rounded-lg px-4 py-2 text-lg text-sm font-medium text-white  focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  },
)

export default SearchModal
