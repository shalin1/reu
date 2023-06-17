import { useEffect, useState } from 'react'
import sanityClient from '../data/sanityClient'

const useSanity = () => {
  const [sanityData, setSanityData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!loading) {
      console.log('pinging sanity')
      setLoading(true)

      sanityClient
        .fetch(
          `*[_type == "reunionFile"]{
        title,
        description
      }`,
        )
        .then((data) => {
          setSanityData(data)
        })
        .then(() => setLoading(false))
        .catch(console.error)
    }
  }, [])
  return { sanityData }
}
export default useSanity
