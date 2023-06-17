// App.tsx
import './App.css'
import React, { useRef, useState } from 'react'
import ReunionFile from './ReunionFile'
import useFiles from './hooks/useFiles'
import { useSearchParams } from 'react-router-dom'
import SearchModal from './components/SearchModal'
import useSearch from './hooks/useSearch'
import useKeyboardNavigation from './hooks/useKeyboardNavigation'
import useSanity from './hooks/useSanity'

const App = () => {
  const { data, loading } = useFiles()
  const { data: sanityData, loading: sanityLoading } = useSanity()
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

  useKeyboardNavigation(nextPage, previousPage, setShowSearchModal)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const file = files[pageNumber || 0]

  return (
    <>
      <SearchModal
        ref={searchInputRef}
        noResults={files.length === 0}
        show={showSearchModal}
        closeModal={() => setShowSearchModal(false)}
        setQuery={search}
      />
      <ReunionFile
        sanityData={sanityData}
        showSearch={() => setShowSearchModal(true)}
        file={file}
        loading={loading && sanityLoading}
        pageNumber={pageNumber}
        search={search}
        nextPage={nextPage}
        previousPage={previousPage}
        numPages={files.length}
      />
    </>
  )
}

export default App
