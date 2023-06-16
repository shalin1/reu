import './App.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReunionFile from './ReunionFile'
import { useFiles } from './Api'
import { useSearchParams } from 'react-router-dom'
import SearchModal from './components/SearchModal'
import { useSearchFiles } from './hooks/useSearch'

const App = () => {
  const { data, error, loading } = useFiles()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNumber = parseInt(searchParams.get('page') || '0')

  const { files, search, query } = useSearchFiles({ data }) // use the hook

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

  const searchInputRef = useRef<HTMLInputElement>(null) // Create a ref for the input
  const updatePage = useCallback(
    (e: KeyboardEvent) => {
      if (!e.metaKey) {
        if (e.key === 'ArrowRight') {
          nextPage()
        }
        if (e.key === 'ArrowLeft') {
          previousPage()
        }
      }

      if (e.metaKey && e.key.toLowerCase() === 'k') {
        console.log('nice')
        e.preventDefault() // Prevent the browser's default search behavior
        setShowSearchModal(true)
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false)
      }
    },
    [nextPage, previousPage],
  )

  useEffect(() => {
    document.addEventListener('keydown', updatePage)
    return () => {
      document.removeEventListener('keydown', updatePage)
    }
  }, [updatePage])

  const file = files[pageNumber || 0]

  return (
    <>
      <SearchModal
        ref={searchInputRef}
        show={showSearchModal}
        closeModal={() => setShowSearchModal(false)}
        query={query}
        setQuery={search}
      />
      <ReunionFile
        showSearch={() => setShowSearchModal(true)}
        file={file}
        loading={loading}
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
