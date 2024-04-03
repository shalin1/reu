import React from 'react'

interface ModalBodyProps {
  setShowModal: (show: boolean) => void
  prevImage: () => void
  nextImage: () => void
  images: string[]
  currentImage: number
}

const ModalBody: React.FC<ModalBodyProps> = ({ setShowModal, prevImage, nextImage, images, currentImage }) => (
  <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none focus:outline-none">
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="flex items-start justify-between border-b p-5">
          <h3 className="text-2xl font-semibold">Procedure Pages</h3>
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
)

export default ModalBody
