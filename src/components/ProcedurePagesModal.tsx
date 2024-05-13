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
import yearChart from '/src/images/year chart.png'

const mapImages = [world, unitedStates, southAmerica, canada, europe, middleEast, asia, africa, oceania]

interface Props {
  hidden: boolean
  showModal: boolean
  setShowModal: (show: boolean) => void
}

const ProcedurePagesModal: React.FC<Props> = ({ hidden, showModal, setShowModal }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [page, setPage] = useState<'index' | 'maps' | 'years'>('index')
  const [images, setImages] = useState(mapImages)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentImage(0)
    setPage('index')
  }
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
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

  const ModalTrigger = () => (
    <button className="btn-primary" onClick={() => setShowModal(true)}>
      Procedure Pages
    </button>
  )

  const ModalBackdrop = () => <div className="fixed inset-0 z-40 bg-black opacity-50" />

  const ModalHeader = () => (
    <div className="flex justify-between border-b py-2 px-4">
      <button
        onClick={() => {
          setPage('index')
          setCurrentImage(0)
        }}
      >
        <h3 className="text-2xl font-semibold">Procedure Pages</h3>
      </button>
      <button
        className="text-3xl leading-none text-black opacity-50 outline-none focus:outline-none"
        onClick={closeModal}
      >
        <span className="text-black opacity-50">×</span>
      </button>
    </div>
  )

  const IndexPage = () => (
    <div className="flex items-center justify-between p-2">
      <ul>
        <li>
          <button onClick={() => setPage('maps')}>
            <h1>Maps</h1>
          </button>
        </li>
        <li>
          <button onClick={() => setPage('years')}>
            <h1>Years</h1>
          </button>
        </li>
      </ul>
    </div>
  )

  const MapsPage = () => (
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

  const YearPage = () => <img src={yearChart} alt={''} />

  const ModalBody = () => (
    <>{page === 'index' ? <IndexPage /> : page === 'years' ? <YearPage /> : page === 'maps' ? <MapsPage /> : null}</>
  )

  const ModalContainer = () => (
    <>
      <div className="fixed inset-4 z-50 flex outline-none focus:outline-none">
        <div className="w-full rounded-lg bg-white shadow-lg">
          <ModalHeader />
          <ModalBody />
        </div>
      </div>
      <ModalBackdrop />
    </>
  )

  const ModalContent = () => {
    const src = images[currentImage]
    return <img src={src} alt="img" className={'border-2'} />
  }

  return (
    <>
      {!hidden && <ModalTrigger />}
      {showModal ? <ModalContainer /> : null}
    </>
  )
}

export default ProcedurePagesModal
