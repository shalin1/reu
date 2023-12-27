// App.tsx
import './App.css'
import React, { useRef, useState } from 'react'
import useFiles from './hooks/useFiles'
import { useSearchParams } from 'react-router-dom'
import useSearch from './hooks/useSearch'
import useKeyboardNavigation from './hooks/useKeyboardNavigation'
import useScrollToTop from './hooks/useScrollToTop'
import useSanity from './hooks/useSanity'

const App = () => {
  const [showModal, setShowModal] = useState(false)
  useScrollToTop()
  const { data, loading } = useFiles()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNumber = parseInt(searchParams.get('page') || '0')

  const { files, search, query } = useSearch({ data })

  const nextPage = () => {
    if (pageNumber < files.length - 1) {
      setSearchParams({ query, page: (pageNumber + 1).toString() })
    }
  }

  const previousPage = () => {
    if (pageNumber > 0) {
      setSearchParams({ query, page: (pageNumber - 1).toString() })
    }
  }

  const disabled = showModal
  useKeyboardNavigation(disabled, nextPage, previousPage, setShowSearchModal)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const file = files[pageNumber || 0]

  const { sanityData } = useSanity()
  return (
    <h1>
      Good luck to peter and all the reunion facilitators in finding a reliable subcontractor for the reunion process
      facilitator's toolkit!
    </h1>
  )
}

export default App
