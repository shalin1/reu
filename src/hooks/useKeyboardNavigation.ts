import { useEffect, useCallback } from 'react'

const useKeyboardNavigation = (nextPage: () => void, previousPage: () => void) => {
  const updatePage = useCallback(
    (e: KeyboardEvent) => {
      if (!e.metaKey) {
        if (e.key === 'ArrowRight') {
          nextPage()
        }
        if (e.key === 'ArrowLeft') {
          previousPage()
        }
      }
    },
    [nextPage, previousPage],
  )

  useEffect(() => {
    document.addEventListener('keydown', updatePage)
    return () => {
      document.removeEventListener('keydown', updatePage)
    }
  }, [updatePage])
}

export default useKeyboardNavigation
