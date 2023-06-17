import { useEffect, useState } from 'react'
import sanityClient from '../data/sanityClient'

const useSanity = () => {
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!loading && !data.length) {
      console.log('pinging sanity')
      setLoading(true)

      sanityClient
        .fetch(
          `*[_type == "reunionFile"]{
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
