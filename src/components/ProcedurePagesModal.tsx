import React, { useState, useEffect } from 'react'

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
import meridianTl from '/src/images/meridian tl.png'
import bladder from '/src/images/bladder.png'
import circulation from '/src/images/circulation-sex.png'
import conception from '/src/images/conception vessel.png'
import gallbladder from '/src/images/gallbladder.png'
import gv from '/src/images/governing vessel.png'
import heart from '/src/images/heart chart.png'
import kidney from '/src/images/kidney.png'
import li from '/src/images/large intestine.png'
import liver from '/src/images/liver.png'
import lung from '/src/images/lung.png'
import si from '/src/images/small intestine.png'
import spleen from '/src/images/spleen.png'
import stomach from '/src/images/stomach.png'
import tw from '/src/images/triple warmer.png'

interface Props {
  hidden: boolean
  showModal: boolean
  setShowModal: (show: boolean) => void
}

const mapImages = [world, unitedStates, southAmerica, canada, europe, middleEast, asia, africa, oceania]
const earImages = [ear1, ear2]
const meridianImages = [
  meridianTl,
  bladder,
  circulation,
  conception,
  gallbladder,
  gv,
  heart,
  kidney,
  li,
  liver,
  lung,
  si,
  spleen,
  stomach,
  tw,
]

const ProcedurePagesModal: React.FC<Props> = ({ hidden, showModal, setShowModal }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [page, setPage] = useState<'index' | 'maps' | 'years' | 'ears' | 'meridians'>('index')
  const [images, setImages] = useState<string[]>([])
  const [isZoomed, setIsZoomed] = useState(false) // New state for zoom

  const nextImage = () => {
    setImages((currentImages) => {
      console.log(currentImages)
      setCurrentImage((prev) => (prev + 1) % currentImages.length)
      return currentImages
    })
  }

  const prevImage = () => {
    setImages((currentImages) => {
      console.log(currentImages)
      setCurrentImage((prev) => (prev - 1 + currentImages.length) % currentImages.length)
      return currentImages
    })
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentImage(0)
    setPage('index')
    setIsZoomed(false) // Reset zoom state on close
    setImages([])
  }

  useEffect(() => {
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

  useEffect(() => {
    setCurrentImage(0)
  }, [images])

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
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <ul className="space-y-4">
        <li>
          <button
            className="w-full rounded-lg bg-purple-400 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => {
              setPage('maps')
              setImages(mapImages)
              setCurrentImage(0)
            }}
          >
            Maps
          </button>
        </li>
        <li>
          <button
            className="w-full rounded-lg bg-purple-400 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => {
              setPage('years')
            }}
          >
            Years
          </button>
        </li>
        <li>
          <button
            className="w-full rounded-lg bg-purple-400 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => {
              setPage('ears')
              setImages(earImages)
              setCurrentImage(0)
            }}
          >
            Ear Chart
          </button>
        </li>
        <li>
          <button
            className="w-full rounded-lg bg-purple-400 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => {
              setPage('meridians')
              setImages(meridianImages)
              setCurrentImage(0)
            }}
          >
            Meridians
          </button>
        </li>
      </ul>
    </div>
  )

  const Carousel = () => (
    <div className="flex h-full w-full items-center justify-center p-2">
      <button
        onClick={prevImage}
        className="h-[100px] w-[70px] rounded-full bg-purple-400 p-3 text-xl text-white hover:bg-purple-500 focus:outline-none"
      >
        &#10094;
      </button>
      <ModalContent />
      <button
        onClick={nextImage}
        className="h-[100px] w-[70px] rounded-full bg-purple-400 p-3 text-xl text-white hover:bg-purple-500 focus:outline-none"
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
        <Carousel />
      ) : page === 'ears' ? (
        <Carousel />
      ) : page === 'meridians' ? (
        <Carousel />
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
