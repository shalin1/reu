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

    // Group files by 'File Code'
    const fileGroups = combinedFilter.reduce((groups: any, file: any) => {
      const key = file['File Code']
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(file)
      return groups
    }, {})

    // Sort within each group
    Object.keys(fileGroups).forEach((key) => {
      fileGroups[key].sort((file1: any, file2: any) => {
        const set1 = file1['Set#']
        const set2 = file2['Set#']

        if (set1 === 'F') return 1
        if (set2 === 'F') return -1

        return Number(set1) - Number(set2)
      })
    })

    // Concatenate all groups together
    const sortedFiles = Object.keys(fileGroups).reduce((result: any[], key: string) => {
      return [...result, ...fileGroups[key]]
    }, [])

    setFiles(sortedFiles)
  }, [data, query])

  const search = (string: string) => {
    const sanitizedSearch = string.replace(/\n/g, ' ').replace('*', '')
    setSearchParams({ query: encodeURIComponent(sanitizedSearch), page: '0' })
  }

  return { files, search, query }
}

export default useSearch
