import './App.css'
import { usePapaParse } from 'react-papaparse'
import React, { useEffect, useState } from 'react'
import filter from 'lodash/filter'
import ReunionFile from './ReunionFile'
// eslint-disable-next-line import/no-unresolved
import csv from './data/tsvfilestest.tsv?url'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([] as any)
  const [pageNumber, setPageNumber] = useState(0)
  const [fileFilter, setFileFilter] = useState('')

  const { readRemoteFile } = usePapaParse()

  useEffect(() => {
    setLoading(true)

    readRemoteFile(csv, {
      header: true,
      delimiter: '\t',
      download: true,
      dynamicTyping: true,
      complete: ({ data }) => {
        setLoading(false)
        setData(data)
      },
    })

    console.log({ data })
    setLoading(false)
  }, [])

  const search = (string: string) => {
    setFileFilter(string.toLowerCase())
    setPageNumber(0)
  }

  const files = filter(data, ({ name }) => {
    if (!name) return false
    if (!fileFilter) return true
    return fileFilter.split(' ').every((searchString) => name.toLowerCase().includes(searchString.toLowerCase().trim()))
  })

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
      />
    </>
  )
}

export default App
