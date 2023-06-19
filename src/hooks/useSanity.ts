import { useEffect, useState } from 'react'
import sanityClient from '../data/sanityClient'

const useSanity = () => {
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!loading && !data.length) {
      setLoading(true)

      sanityClient
        .fetch(
          `*[_type == "reunionFileDescription"]{
        title,
        description
      }`,
        )
        .then(setData)
        .then(() => setLoading(false))
        .catch(console.error)
    }
  }, [])
  return { loading, data }
}
export default useSanity
