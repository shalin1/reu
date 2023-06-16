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
    const filteredFiles = data.filter((file: any) => {
      const fileName = file['File Code']
      if (!fileName) return false
      if (!query) return true
      const fileNameWords = fileName.toLowerCase().split(' ')

      return searchWords.every((searchString: string) => {
        const sanitizedString = searchString.replace(/\n/g, ' ').replace('*', '')
        return fileNameWords.some((fileName: string) => {
          if (fileName[0] === '(') {
            return fileName.includes(sanitizedString.toLowerCase().trim())
          }
          return fileName.startsWith(sanitizedString.toLowerCase().trim())
        })
      })
    })

    const sortedFiles = filteredFiles.sort((file1: any, file2: any) => {
      const file1NameWords = file1['File Code'].toLowerCase().split(' ')
      const file2NameWords = file2['File Code'].toLowerCase().split(' ')

      const file1TightMatch = searchWords.every((searchString: string) =>
        file1NameWords.some((word: string) => word === `(${searchString.toLowerCase().trim()})`),
      )

      const file2TightMatch = searchWords.every((searchString: string) =>
        file2NameWords.some((word: string) => word === `(${searchString.toLowerCase().trim()})`),
      )

      if (file1TightMatch && !file2TightMatch) {
        return -1
      }
      if (!file1TightMatch && file2TightMatch) {
        return 1
      }

      const file1FullWordMatch = searchWords.every((searchString: string) =>
        file1NameWords.some((word: string) => word === searchString.toLowerCase().trim()),
      )

      const file2FullWordMatch = searchWords.every((searchString: string) =>
        file2NameWords.some((word: string) => word === searchString.toLowerCase().trim()),
      )

      if (file1FullWordMatch && !file2FullWordMatch) {
        return -1
      }
      if (!file1FullWordMatch && file2FullWordMatch) {
        return 1
      }

      const sanitizeForSort = (fileName: string) => {
        let sanitized = fileName.toLowerCase().replace(/\*$/, '') // Remove trailing *
        sanitized = sanitized.replace(/\bfacilitation\b/, '') // Remove 'facilitation'
        return sanitized.trim() // Remove leading and trailing spaces
      }
      if (file1['File Code'] === file2['File Code']) {
        const setNumber1 = file1['Set#'] === 'F' ? Infinity : parseInt(file1['Set#'], 10)
        const setNumber2 = file2['Set#'] === 'F' ? Infinity : parseInt(file2['Set#'], 10)
        return setNumber1 - setNumber2
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
