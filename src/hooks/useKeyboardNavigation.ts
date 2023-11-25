import { useEffect, useCallback } from 'react'

const useKeyboardNavigation = (
  disabled = false,
  nextPage: () => void,
  previousPage: () => void,
  setShowSearchModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const updatePage = useCallback(
    (e: KeyboardEvent) => {
      if (!e.metaKey && !disabled) {
        if (e.key === 'ArrowRight') {
          nextPage()
        }
        if (e.key === 'ArrowLeft') {
          previousPage()
        }
      }

      if (e.metaKey && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'f')) {
        e.preventDefault()
        setShowSearchModal(true)
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        setShowSearchModal(false)
      }
    },
    [nextPage, previousPage, setShowSearchModal],
  )

  useEffect(() => {
    document.addEventListener('keydown', updatePage)
    return () => {
      document.removeEventListener('keydown', updatePage)
    }
  }, [updatePage])
}

export default useKeyboardNavigation
