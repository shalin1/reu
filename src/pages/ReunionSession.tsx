import React, { useRef, useState } from 'react'
import ReunionFile from '../components/ReunionFile'
import useFiles from '../hooks/useFiles'
import { useSearchParams } from 'react-router-dom'
import SearchModal from '../components/SearchModal'
import useSearch from '../hooks/useSearch'
import useKeyboardNavigation from '../hooks/useKeyboardNavigation'
import useScrollToTop from '../hooks/useScrollToTop'
import ProcedurePagesModal from '../components/ProcedurePagesModal'
import useSanity from '../hooks/useSanity'
import LogoutButton from '../components/LogoutButton'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'
import './ReunionSession.css'

const ReunionSession = () => {
  const [showModal, setShowModal] = useState(false)
  useScrollToTop()
  const { data, loading } = useFiles()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNumber = parseInt(searchParams.get('page') || '0')

  const { files, search, query } = useSearch({ data })

  const nextPage = () => {
    if (pageNumber < files.length - 1) {
      setSearchParams({ query, page: (pageNumber + 1).toString() })
    }
  }

  const previousPage = () => {
    if (pageNumber > 0) {
      setSearchParams({ query, page: (pageNumber - 1).toString() })
    }
  }

  const disabled = showModal
  useKeyboardNavigation(disabled, nextPage, previousPage, setShowSearchModal)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const file = files[pageNumber || 0]

  const { sanityData } = useSanity(`*[_type == "reunionFile"]{ title, description, pages[]-> }`)

  const { isLoading: auth0IsLoading, sanityUser } = useAuth0UserWithSanity()

  if (auth0IsLoading) {
    return <div>Loading...</div>
  }

  console.log('sanityUser', sanityUser)

  // const stripeCustomerId = sanityUser && sanityUser.stripeCustomerId

  // const {
  //   isPending,
  //   error,
  //   data: stripeData,
  // } = useQuery({
  //   queryKey: ['stripeSubscriptions', stripeCustomerId],
  //   queryFn: () => getStripeSubscriptionStatus(stripeCustomerId),
  // })

  // if (isPending) return <div>Loading...</div>

  // if (error) return <div>An error has occurred: {error.message}</div>

  // console.log(stripeData)

  return (
    <>
      <div className="text-right">
        <LogoutButton />
      </div>
      <SearchModal
        ref={searchInputRef}
        show={showSearchModal}
        closeModal={() => setShowSearchModal(false)}
        setQuery={search}
      />
      <ReunionFile
        sanityData={sanityData}
        showSearch={() => setShowSearchModal(true)}
        file={file}
        loading={loading}
        pageNumber={pageNumber}
        search={search}
        nextPage={nextPage}
        previousPage={previousPage}
        numPages={files.length}
      />
      <ProcedurePagesModal showModal={showModal} setShowModal={setShowModal} hidden={loading || !sanityData} />
    </>
  )
}

export default ReunionSession
