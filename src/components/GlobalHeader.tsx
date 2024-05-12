import React from 'react'
import ProcedurePagesModal from './ProcedurePagesModal'
import MainMenuButton from './MainMenuButton'

interface Props {
  showModal: boolean
  setShowModal: (arg: boolean) => void
  loading: boolean
  sanityData: any[]
  setShowSearchModal: (arg: boolean) => void
}
const GlobalHeader: React.FC<Props> = ({ showModal, setShowModal, loading, sanityData, setShowSearchModal }) => {
  if (loading) return <></>
  return (
    <div className="align-center flex justify-center gap-2 py-2 text-right sm:justify-between">
      <MainMenuButton />
      <div className="flex gap-2">
        <ProcedurePagesModal showModal={showModal} setShowModal={setShowModal} hidden={loading || !sanityData} />
        <button onClick={() => setShowSearchModal(true)} className="btn-primary">
          Search
        </button>
      </div>
    </div>
  )
}

export default GlobalHeader
