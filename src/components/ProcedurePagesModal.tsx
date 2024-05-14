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
import ear1 from '/src/images/ear 1.png'
import ear2 from '/src/images/ear 2.png'

interface Props {
  hidden: boolean
  showModal: boolean
  setShowModal: (show: boolean) => void
}

const mapImages = [world, unitedStates, southAmerica, canada, europe, middleEast, asia, africa, oceania]
const earImages = [ear1, ear2]

const ProcedurePagesModal: React.FC<Props> = ({ hidden, showModal, setShowModal }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [page, setPage] = useState<'index' | 'maps' | 'years' | 'ears'>('index')
  const [images, setImages] = useState(mapImages)
  const [isZoomed, setIsZoomed] = useState(false) // New state for zoom

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
    setIsZoomed(false) // Reset zoom state on close
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
          <button
            onClick={() => {
              setPage('maps')
              setImages(mapImages)
            }}
          >
            <h1>Maps</h1>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setPage('years')
            }}
          >
            <h1>Years</h1>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setPage('ears')
              setImages(earImages)
            }}
          >
            <h1>Ear Chart</h1>
          </button>
        </li>
      </ul>
    </div>
  )

  const MyCoolCarousel = () => (
    <div className="flex h-full w-full items-center justify-center p-2">
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

  const YearPage = () => <img src={yearChart} alt="year chart" className="max-h-full max-w-full object-contain" />

  const ModalBody = () => (
    <div className="relative flex h-[80vh] w-full items-center justify-center">
      {page === 'index' ? (
        <IndexPage />
      ) : page === 'years' ? (
        <YearPage />
      ) : page === 'maps' ? (
        <MyCoolCarousel />
      ) : page === 'ears' ? (
        <MyCoolCarousel />
      ) : null}
    </div>
  )

  const ModalContainer = () => (
    <>
      <div className="fixed inset-2 z-50 flex items-center justify-center outline-none focus:outline-none">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
          <ModalHeader />
          <div className="relative flex-auto p-6">
            <ModalBody />
          </div>
        </div>
      </div>
      <ModalBackdrop />
    </>
  )

  const ModalContent = () => {
    const src = images[currentImage]
    const zoomClass = isZoomed ? 'scale-150' : 'scale-100' // CSS class for zoom effect
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={src}
          alt="img"
          className={`max-h-full max-w-full object-contain transition-transform duration-300 ${zoomClass}`}
          onClick={() => setIsZoomed(!isZoomed)} // Toggle zoom on click
        />
      </div>
    )
  }

  return (
    <>
      {!hidden && <ModalTrigger />}
      {showModal ? <ModalContainer /> : null}
    </>
  )
}

export default ProcedurePagesModal
