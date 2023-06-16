import { useEffect, useState } from 'react'
import sanityClient from '../data/sanityClient'

const useSanity = () => {
  const [sanityData, setSanityData] = useState<any>([])
  useEffect(() => {
    console.log('pinging sanity')
    if (sanityData.length === 0)
      sanityClient
        .fetch(
          `*[_type == "reunionFile"]{
        title,
        description
      }`,
        )
        .then((data) => setSanityData(data))
        .catch(console.error)
  }, [])
  return { sanityData }
}
export default useSanity
