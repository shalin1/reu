import React, { useEffect, useRef, useState } from 'react'
import ReunionFile from '../components/ReunionFile'
import useFiles from '../hooks/useFiles'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import SearchModal from '../components/SearchModal'
import useSearch from '../hooks/useSearch'
import useKeyboardNavigation from '../hooks/useKeyboardNavigation'
import useScrollToTop from '../hooks/useScrollToTop'
import ProcedurePagesModal from '../components/ProcedurePagesModal'
import useSanity from '../hooks/useSanity'
import LogoutButton from '../components/LogoutButton'
import useAuth0UserWithSanity from '../hooks/useAuth0UserWithSanity'
import { getStripeSubscriptionStatus } from '../api'
import './ReunionSession.css'

const ReunionSession = () => {
  const [showModal, setShowModal] = useState(false)
  useScrollToTop()
  const { data, loading } = useFiles()
  const [showSearchModal, setShowSearchModal] = useState(false)
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
  } = useQuery({
    queryKey: ['stripeSubscriptions'],
    queryFn: () => getStripeSubscriptionStatus(sanityUser?.stripeCustomerId),
    enabled: Boolean(sanityUser?.stripeCustomerId),
  })

  if (auth0IsLoading) {
    console.log('auth0IsLoading')
    return <div>Loading...</div>
  }

  if (sanityUser?.stripeCustomerId && isPending) {
    return <div>Loading...</div>
  }

  if (error) return <div>An error has occurred: {error.message}</div>

  useEffect(() => {
    if (sanityUser) {
      if (!sanityUser.stripeCustomerId || !hasActiveSubscription) {
        navigate('/order/checkout')
      }
    }
  }, [sanityUser])

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
