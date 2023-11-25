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
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none focus:outline-none">
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="flex items-start justify-between border-b p-5">
                <h3 className="text-2xl font-semibold">Modal Title</h3>
                <button
                  className="text-3xl leading-none text-black opacity-50 outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="text-black opacity-50">×</span>
                </button>
              </div>

              <div className="flex h-[90vh] items-center justify-between p-6">
                <button
                  onClick={prevImage}
                  className="h-[100px] w-[70px] rounded-full bg-violet-400 p-3 text-xl text-white hover:bg-blue-700 focus:outline-none"
                >
                  &#10094;
                </button>
                <img src={images[currentImage]} alt="Procedure Map" className="object-fit max-h-[80vh] max-w-[70vw]" />
                <button
                  onClick={nextImage}
                  className="h-[100px] w-[70px] rounded-full bg-violet-400 p-3 text-xl text-white hover:bg-blue-700 focus:outline-none"
                >
                  &#10095;
                </button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
        </>
      ) : null}
    </>
  )
}

export default ProcedurePagesModal
