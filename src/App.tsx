import './App.css'
import React, { useEffect, useState } from 'react'
import filter from 'lodash/filter'
import ReunionFile from './ReunionFile'
import { useFiles } from './Api'
import SearchInput from './SearchInput'
import { useSearchParams } from 'react-router-dom'

const App = () => {
  const { data, error, loading } = useFiles()
  const [files, setFiles] = useState([] as any)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') || ''
  const pageNumber = parseInt(searchParams.get('page') || '0')

  useEffect(() => {
    const filteredFiles = filter(data, (file: any) => {
      const name = file['File Code']
      if (!name) return false
      if (!query) return true
      return query.split(' ').every((searchString) => name.toLowerCase().includes(searchString.toLowerCase().trim()))
    })
    setFiles(filteredFiles)
  }, [data, query])

  const setQuery = (string: string) => {
    setSearchParams({ query: string.toLowerCase().replace('*', ''), page: '0' })
  }
  const setPageNumber = (page: number) => {
    setSearchParams({ query, page: page.toString() })
  }

  const file = files[pageNumber || 0]

  return (
    <>
      <SearchInput query={query} setQuery={setQuery} />
      <ReunionFile
        file={file}
        loading={loading && file}
        pageNumber={pageNumber}
        search={setQuery}
        setPageNumber={setPageNumber}
        numPages={files.length}
      />
    </>
  )
}

export default App
