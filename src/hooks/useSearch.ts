// useSearch.tsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface SearchFilesParams {
  data: any[]
}

const useSearch = ({ data }: SearchFilesParams) => {
  const [searchParams, setSearchParams] = useSearchParams()
  let query = decodeURIComponent(searchParams.get('query') || '')
  query = query.replace(/\r/g, ' ').replace(/\*/, '')
  const searchWords = query.toLowerCase().trim().split(' ')
  const [files, setFiles] = useState([] as any)

  useEffect(() => {
    let filteredFiles
    if (query === 'Inherited') {
      filteredFiles = data.filter((file: any) => file['File Code'].toLowerCase().includes('*inherited'))
    } else if (query === 'Prepare') {
      filteredFiles = data.filter((file: any) => file['File Code'].toLowerCase().includes('*prepare'))
    } else if (query === 'who') {
      filteredFiles = data.filter((file: any) => file['File Code'].toLowerCase().includes('*who'))
    } else {
      filteredFiles = data.filter((file: any) => {
        const fileName = file['File Code']
        if (!fileName) return false
        if (!query) return true
        const fileNameWords = fileName.toLowerCase().split(' ')

        return searchWords.every((searchString: string) => {
          return fileNameWords.some((fileNameWord: string) => {
            if (fileNameWord[0] === '(' || fileNameWord[0] === '*') {
              return fileNameWord.slice(1).startsWith(searchString.toLowerCase().trim())
            }
            return fileNameWord.startsWith(searchString.toLowerCase().trim())
          })
        })
      })
    }

    const sortedFiles = filteredFiles.sort((file1: any, file2: any) => {
      const sanitizeForSort = (fileName: string) => {
        let sanitized = fileName.toLowerCase().replace(/\*$/, '') // Remove trailing *
        sanitized = sanitized.replace(/\bfacilitation\b.*$/, '') // Remove 'facilitation' and all following characters
        return sanitized.trim() // Remove leading and trailing spaces
      }

      const file1Name = sanitizeForSort(file1['File Code'])
      const file2Name = sanitizeForSort(file2['File Code'])
      const file1NameWords = file1Name.split(' ')
      const file2NameWords = file2Name.split(' ')

      // Check if either file is 'OPENING ENTRY FORMS (EF)' and send to the front
      if (file1Name === 'opening entry forms (ef)') return -1
      if (file2Name === 'opening entry forms (ef)') return 1

      // Check if either file is 'iself recognitions' and send to the back
      if (file1Name === 'opening: iself recognitions (isr) (ef)') return 1
      if (file2Name === 'opening: iself recognitions (isr) (ef)') return -1

      if (file1Name === file2Name) {
        const setNumber1 = file1['Set#'] === 'F' ? Infinity : parseInt(file1['Set#'], 10)
        const setNumber2 = file2['Set#'] === 'F' ? Infinity : parseInt(file2['Set#'], 10)
        return setNumber1 - setNumber2
      }

      const file1ParensMatch = searchWords.every((searchString: string) =>
        file1NameWords.some((word: string) => word === `(${searchString.toLowerCase().trim()})`),
      )

      const file2ParensMatch = searchWords.every((searchString: string) =>
        file2NameWords.some((word: string) => word === `(${searchString.toLowerCase().trim()})`),
      )

      if (file1ParensMatch && !file2ParensMatch) {
        return -1
      }
      if (!file1ParensMatch && file2ParensMatch) {
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

      return 0
    })

    setFiles(sortedFiles)
  }, [data, query])

  const search = (string: string) => {
    if (!string) return setSearchParams({ query: 'EF', page: '0' })

    if (string === 'IMPLANT\rIndex') {
      return setSearchParams({ query: encodeURIComponent('implant index'), page: '0' })
    }
    const sanitizedSearch = string.replace(/\n/g, ' ').replace(/^\*|\*$/g, '') // Remove leading and trailing *

    setSearchParams({ query: encodeURIComponent(sanitizedSearch), page: '0' })
  }

  return { files, search, query }
}

export default useSearch
