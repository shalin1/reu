import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const useScrollToTop = (): null => {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [searchParams])

  return null
}

export default useScrollToTop
