import './App.css'
import React, { useEffect, useState } from 'react'
import filter from 'lodash/filter'
import ReunionFile from './ReunionFile'
import { useFiles } from './Api'
import SearchInput from './components/SearchInput'
import { useSearchParams } from 'react-router-dom'

const App = () => {
  const { data, error, loading } = useFiles()
  const [files, setFiles] = useState([] as any)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') || ''
  const pageNumber = parseInt(searchParams.get('page') || '0')

  useEffect(() => {
    const tightFilter = filter(data, (file: any) => {
        const fileName = file['File Code']
        if (!fileName) return false
        if (!query) return true
      return query.split(' ').every((searchString:string ) => (
          fileName.toLowerCase().split(" ").some((word:string) => (
              word.startsWith(searchString.toLowerCase().trim()))
          )))
    })

    const looseFilter = filter(data, (file: any) => {
      const fileName = file['File Code']
      if (!fileName) return false
      if (!query) return true
      return query.split(' ').some((searchString:string ) => (
              fileName.toLowerCase().split(" ").some((word:string) => (
                  word.startsWith(searchString.toLowerCase().trim()))
              )))
    })
    const looseFilterListFilteredWithTightFilterItemsFirst = filter(looseFilter, (looseFilterItem:any) => {
        return tightFilter.some((tightFilterItem:any) => {
            return tightFilterItem['File Code'] === looseFilterItem['File Code']
        })
    })
    setFiles(looseFilterListFilteredWithTightFilterItemsFirst)
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
        loading={loading}
        pageNumber={pageNumber}
        search={setQuery}
        setPageNumber={setPageNumber}
        numPages={files.length}
      />
    </>
  )
}

export default App
