import './App.css'
import React, { useEffect, useState } from 'react'
import filter from 'lodash/filter'
import ReunionFile from './ReunionFile'
// eslint-disable-next-line import/no-unresolved
import { useFiles } from './Api'

const App = () => {
  const { data, error, loading } = useFiles()
  const [files, setFiles] = useState([] as any)
  const [pageNumber, setPageNumber] = useState(0)
  const [fileFilter, setFileFilter] = useState('')

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
    setFileFilter(string.toLowerCase().replace('*', ''))
    setPageNumber(0)
  }

  const file = files[pageNumber]

  return (
    <>
      <input
        className="border-2 border-solid border-black"
        type="text"
        value={fileFilter}
        onChange={(event) => search(event.target.value)}
      />
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
