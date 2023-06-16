// useSearch.tsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface SearchFilesParams {
  data: any[]
}

const useSearch = ({ data }: SearchFilesParams) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = decodeURIComponent(searchParams.get('query') || '')
  const searchWords = query.toLowerCase().split(' ')
  const [files, setFiles] = useState([] as any)

  useEffect(() => {
    const combinedFilter = data.filter((file: any) => {
      const fileName = file['File Code']
      if (!fileName) return false
      if (!query) return true
      const fileNameWords = fileName.toLowerCase().split(' ')

      return searchWords.every((searchString: string) =>
        fileNameWords.some((word: string) => word.includes(searchString.toLowerCase().trim())),
      )
    })

    const sortedFiles = combinedFilter.sort((file1: any, file2: any) => {
      const file1NameWords = file1['File Code'].toLowerCase().split(' ')
      const file2NameWords = file2['File Code'].toLowerCase().split(' ')

      const file1TightMatch = searchWords.every((searchString: string) =>
        file1NameWords.some((word: string) => word.includes(`(${searchString.toLowerCase().trim()})`)),
      )

      const file2TightMatch = searchWords.every((searchString: string) =>
        file2NameWords.some((word: string) => word.includes(`(${searchString.toLowerCase().trim()})`)),
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

  return { files, search, query }
}

export default useSearch
