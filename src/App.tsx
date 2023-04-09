import './App.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReunionFile from './ReunionFile'
import { useFiles } from './Api'
import { useSearchParams } from 'react-router-dom'
import SearchModal from './components/SearchModal'

const App = () => {
  const { data, error, loading } = useFiles()
  const [files, setFiles] = useState([] as any)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = decodeURIComponent(searchParams.get('query') || '')
  const searchWords = query.toLowerCase().split(' ')
  const pageNumber = parseInt(searchParams.get('page') || '0')

  useEffect(() => {
    const combinedFilter = data.filter((file: any) => {
      const fileName = file['File Code']
      if (!fileName) return false
      if (!query) return true
      const fileNameWords = fileName.toLowerCase().split(' ')
      if (
        searchWords.every((searchString: string) =>
          fileNameWords.some((word: string) => word.includes(searchString.toLowerCase().trim())),
        )
      ) {
        return true
      }
      return false
    })
    // Sort the results to prioritize tight filter matches
    const sortedFiles = combinedFilter.sort((file1: any, file2: any) => {
      const file1NameWords = file1['File Code'].toLowerCase().split(' ')
      const file2NameWords = file2['File Code'].toLowerCase().split(' ')
      // Check if file1 matches the tight filter
      const file1TightMatch = searchWords.every((searchString: string) =>
        file1NameWords.some((word: string) => word.includes(searchString.toLowerCase().trim())),
      )
      // Check if file2 matches the tight filter
      const file2TightMatch = searchWords.every((searchString: string) =>
        file2NameWords.some((word: string) => word.includes(searchString.toLowerCase().trim())),
      )
      if (file1TightMatch && !file2TightMatch) {
        return -1
      }
      if (!file1TightMatch && file2TightMatch) {
        return 1
      }
      return 0
    })
    setFiles(sortedFiles)
  }, [data, query])

  const search = (string: string) => {
    const sanitizedSearch = string.replace(/\n/g, ' ').replace('*', '')
    setSearchParams({ query: encodeURIComponent(sanitizedSearch), page: '0' })
  }
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
