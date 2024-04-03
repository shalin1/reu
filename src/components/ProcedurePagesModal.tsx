import React, { useState } from 'react'

// Import images
import europe from '../images/europe.jpg'
import unitedStates from '../images/united states.jpg'
import africa from '../images/africa.jpg'
import middleEast from '../images/middle east.jpg'
import world from '../images/world.jpg'
import asia from '../images/asia.jpg'
import oceania from '../images/oceania.jpg'
import canada from '../images/canada.jpg'
import southAmerica from '../images/south america.jpg'
import ModalBody from './ModalBody'

const images = [europe, unitedStates, africa, middleEast, world, asia, oceania, canada, southAmerica]

interface Props {
  hidden: boolean
  showModal: boolean
  setShowModal: (show: boolean) => void
}

const ProcedurePagesModal: React.FC<Props> = ({ hidden, showModal, setShowModal }) => {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false)
      } else if (showModal) {
        if (e.key === 'ArrowRight') {
          nextImage()
        } else if (e.key === 'ArrowLeft') {
          prevImage()
        }
      }
    }

    window.addEventListener('keydown', listener)
    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [showModal])

  return (
    <>
      {!hidden && (
        <div>
          <button
            className="rounded bg-violet-400 p-3 text-white hover:bg-violet-500 focus:outline-none"
            onClick={() => setShowModal(true)}
          >
            Show procedure pages
          </button>
        </div>
      )}
      {showModal && (
        <ModalBody
          setShowModal={setShowModal}
          prevImage={prevImage}
          nextImage={nextImage}
          images={images}
          currentImage={currentImage}
        />
      )}
    </>
  )
}

export default ProcedurePagesModal
