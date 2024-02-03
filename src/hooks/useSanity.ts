import { useEffect, useState } from 'react'
import sanityClient from '../data/sanityClient'

const useSanity = (query: string, params: object = {}) => {
  const [sanityData, setData] = useState<any>(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!loading && !sanityData.length) {
      setLoading(true)

      sanityClient
        .fetch(query, params)
        .then(setData)
        .then(() => setLoading(false))
        .catch(console.error)
    }
  }, [])
  return { loading, sanityData }
}
export default useSanity
