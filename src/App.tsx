import './App.css'
import React, { useEffect, useState } from 'react'
import filter from 'lodash/filter'
import ReunionFile from './ReunionFile'
// eslint-disable-next-line import/no-unresolved
import { useFiles } from './Api'
import SearchInput from './SearchInput'
import { useSearchParams } from 'react-router-dom'

const App = () => {
  const { data, error, loading } = useFiles()
  const [files, setFiles] = useState([] as any)
  const [searchParams, setSearchParams] = useSearchParams()
  const fileFilter = searchParams.get('query') || ''
  const pageNumber = parseInt(searchParams.get('page') || '0')

  useEffect(() => {
    const filteredFiles = filter(data, (file: any) => {
      const name = file['File Code']
      if (!name) return false
      if (!fileFilter) return true
      return fileFilter
        .split(' ')
        .every((searchString) => name.toLowerCase().includes(searchString.toLowerCase().trim()))
    })
    setFiles(filteredFiles)
  }, [data, fileFilter])

  const search = (string: string) => {
    setSearchParams({ query: string.toLowerCase().replace('*', ''), page: '0' })
  }
  const setPageNumber = (page: number) => {
    setSearchParams({ query: fileFilter, page: page.toString() })
  }

  const file = files[pageNumber || 0]

  return (
    <>
      <SearchInput />
      <ReunionFile
        file={file}
        loading={loading && file}
        pageNumber={pageNumber}
        search={search}
        setPageNumber={setPageNumber}
        numPages={files.length}
      />
    </>
  )
}

export default App
