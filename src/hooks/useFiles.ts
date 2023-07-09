// eslint-disable-next-line import/no-unresolved
import xlsx from '../data/July 8.xlsx?url'
import { useEffect, useState } from 'react'
import { read, utils } from 'xlsx'

export type FileMakerProTsvRow = any

const useFiles = () => {
  const [data, setData] = useState<FileMakerProTsvRow>([])
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    try {
      ;(async () => {
        setLoading(true)
        /* man is this u.g.l.y. */
        const f = await (await fetch(xlsx)).arrayBuffer()
        const wb = read(f) // parse the array buffer
        const ws = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
        const data: any[] = utils.sheet_to_json<any>(ws) // generate objects
        setData(data) // update state
        setLoading(false)
      })()
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(error)
    }
  }, [])

  return { data, error, loading }
}

export default useFiles
