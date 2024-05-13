import React, { useState } from 'react'

// Import images
import europe from '/src/images/europe.jpg'
import unitedStates from '/src/images/united states.jpg'
import africa from '/src/images/africa.jpg'
import middleEast from '/src/images/middle east.jpg'
import world from '/src/images/world.jpg'
import asia from '/src/images/asia.jpg'
import oceania from '/src/images/oceania.jpg'
import canada from '/src/images/canada.jpg'
import southAmerica from '/src/images/south america.jpg'

const mapImages = [world, unitedStates, southAmerica, canada, europe, middleEast, asia, africa, oceania]

interface Props {
  hidden: boolean
  showModal: boolean
  setShowModal: (show: boolean) => void
}

const ProcedurePagesModal: React.FC<Props> = ({ hidden, showModal, setShowModal }) => {
  const [currentImage, setCurrentImage] = useState(0)

  const images = mapImages

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

  const ModalButton = () => (
    <button className="btn-primary" onClick={() => setShowModal(true)}>
      Procedure Pages
    </button>
  )

  const ModalBackdrop = () => <div className="fixed inset-0 z-40 bg-black opacity-50" />

  const ModalHeader = () => (
    <div className="flex justify-between border-b p-5">
      <h3 className="text-2xl font-semibold">Procedure Pages</h3>
      <button
        className="text-3xl leading-none text-black opacity-50 outline-none focus:outline-none"
        onClick={() => setShowModal(false)}
      >
        <span className="text-black opacity-50">×</span>
      </button>
    </div>
  )

  const ModalBody = () => (
    <div className="flex items-center justify-between p-2">
      <button
        onClick={prevImage}
        className="h-[100px] w-[70px] rounded-full bg-violet-400 p-3 text-xl text-white hover:bg-blue-700 focus:outline-none"
      >
        &#10094;
      </button>
      <ModalContent />
      <button
        onClick={nextImage}
        className="h-[100px] w-[70px] rounded-full bg-violet-400 p-3 text-xl text-white hover:bg-blue-700 focus:outline-none"
      >
        &#10095;
      </button>
    </div>
  )

  const ModalContainer = () => (
    <>
      <div className="fixed inset-0 z-50 flex p-4 outline-none focus:outline-none">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg">
          <ModalHeader />
          <ModalBody />
        </div>
      </div>
      <ModalBackdrop />
    </>
  )

  const ModalContent = () => {
    const src = images[currentImage]
    return <img src={src} alt="img" className="max-h- h-fit w-fit" />
  }

  return (
    <>
      {!hidden && <ModalButton />}
      {showModal ? <ModalContainer /> : null}
    </>
  )
}

export default ProcedurePagesModal
