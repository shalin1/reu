import React from 'react'
import ProcedurePagesModal from './ProcedurePagesModal'
import LogoutButton from './LogoutButton'

interface Props {
  showModal: boolean
  setShowModal: (arg: boolean) => void
  loading: boolean
  sanityData: any[]
  setShowSearchModal: (arg: boolean) => void
}
const GlobalHeader: React.FC<Props> = ({ showModal, setShowModal, loading, sanityData, setShowSearchModal }) => {
  return (
    <div className="align-center flex justify-end gap-1 py-2 text-right">
      <button onClick={() => setShowSearchModal(true)} className="btn-primary">
        Search
      </button>
      <ProcedurePagesModal showModal={showModal} setShowModal={setShowModal} hidden={loading || !sanityData} />
      <LogoutButton />
    </div>
  )
}

export default GlobalHeader
