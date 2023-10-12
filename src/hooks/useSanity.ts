import { useEffect, useState } from 'react'
import sanityClient from '../data/sanityClient'

const useSanity = () => {
  const [sanityData, setData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!loading && !sanityData.length) {
      setLoading(true)

      sanityClient
        .fetch(
          `*[_type == "reunionFile"]{
        title,
        description,
        q1r1,
      }`,
        )
        .then(setData)
        .then(() => setLoading(false))
        .catch(console.error)
    }
  }, [])
  return { loading, sanityData }
}
export default useSanity
