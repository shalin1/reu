import './App.css'
import Papa from 'papaparse'
import React, { useEffect, useState } from 'react'
import filter from 'lodash/filter'
import ReunionFile from './ReunionFile'
// eslint-disable-next-line import/no-unresolved
import csv from './data/thefiles.csv?url'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([] as any)
  const [pageNumber, setPageNumber] = useState(0)
  const [fileFilter, setFileFilter] = useState('')

  useEffect(() => {
    setLoading(true)

    Papa.parse(csv, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: ({ data }) => {
        setLoading(false)
        setData(data)
      },
    })

    setLoading(false)
  }, [])

  const search = (e: any) => {
    setFileFilter(e.target.value.toLowerCase())
    setPageNumber(0)
  }

  const files = filter(data, ({ name }) => {
    if (!name) return false
    if (!fileFilter) return true
    return fileFilter.split(' ').every((searchString) => name.toLowerCase().includes(searchString.toLowerCase()))
  })

  const file = files[pageNumber] || files[0]

  return (
    <>
      <input className="border-2 border-solid border-black" type="text" value={fileFilter} onChange={search} />
      <ReunionFile
        file={file}
        loading={loading && file}
        pageNumber={pageNumber}
        setFileFilter={setFileFilter}
        setPageNumber={setPageNumber}
      />
    </>
  )
}

export default App
