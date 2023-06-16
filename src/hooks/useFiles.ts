// eslint-disable-next-line import/no-unresolved
import csv from '../data/tsvfilestest.tsv?url'
import { readRemoteFile } from 'react-papaparse'
import { useEffect, useState } from 'react'
import sanityClient from '../data/sanityClient'

export type FileMakerProTsvRow = any

const useFiles = () => {
  const [data, setData] = useState<FileMakerProTsvRow>([])
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      setLoading(true)

      readRemoteFile(csv, {
        header: true,
        delimiter: '\t',
        download: true,
        dynamicTyping: true,
        complete: ({ data }) => {
          setData(data)
          setLoading(false)
        },
      })
    } catch (err) {
      setError(err)
    }
  }, [csv])

  return { data, error, loading }
}

export default useFiles
