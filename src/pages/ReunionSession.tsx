import React, { useEffect, useRef, useState } from 'react'
import ReunionFile from '../components/ReunionFile'
import useFiles from '../hooks/useFiles'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import SearchModal from '../components/SearchModal'
import useSearch from '../hooks/useSearch'
import useKeyboardNavigation from '../hooks/useKeyboardNavigation'
import useScrollToTop from '../hooks/useScrollToTop'
import useSanity from '../hooks/useSanity'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'
import { getHasActiveStripeSubscription } from '../api'
import './ReunionSession.css'
import GlobalHeader from '../components/GlobalHeader'
import LogoutButton from '../components/LogoutButton'

const ReunionSession = () => {
  const [showModal, setShowModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [shouldNavigate, setShouldNavigate] = useState(false)
  useScrollToTop()
  const { data, loading } = useFiles()
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNumber = parseInt(searchParams.get('page') || '0')
  const navigate = useNavigate()

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

  const {
    isPending,
    error,
    data: hasActiveSubscription,
    isFetched,
  } = useQuery({
    queryKey: ['stripeSubscriptions'],
    queryFn: () => getHasActiveStripeSubscription(sanityUser?.stripeCustomerId),
    enabled: Boolean(sanityUser?.stripeCustomerId),
  })

  useEffect(() => {
    if (auth0IsLoading) return
    if (!sanityUser) return
    if (!sanityUser.stripeCustomerId) return setShouldNavigate(true)
    if (isFetched && !hasActiveSubscription) return setShouldNavigate(true)
  }, [auth0IsLoading, sanityUser, isFetched, hasActiveSubscription])

  useEffect(() => {
    if (shouldNavigate && !import.meta.env.VITE_DISABLE_PAYWALL) {
      navigate('/order/checkout')
    }
  }, [shouldNavigate])
  const consolidatedLoading = auth0IsLoading || (sanityUser?.stripeCustomerId && isPending) || loading || !sanityData

  if (consolidatedLoading) {
    return <h1>Loading...</h1>
  }

  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="w-100">
      <GlobalHeader
        sanityData={sanityData}
        loading={consolidatedLoading}
        setShowModal={setShowModal}
        setShowSearchModal={setShowSearchModal}
        showModal={showModal}
      />
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
        pageNumber={pageNumber}
        search={search}
        nextPage={nextPage}
        previousPage={previousPage}
        numPages={files.length}
      />
      <div className="mb-2Gj float-right">{!loading && auth0IsLoading && <LogoutButton />}</div>
    </div>
  )
}

export default ReunionSession
