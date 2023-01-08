import React from 'react'

interface Props {
  file: any
  numPages: number
  pageNumber: number
  setPageNumber: (i: number) => void
}
const Header: React.FC<Props> = ({ file, numPages, setPageNumber, pageNumber }) => {
  return (
    <div className="flex justify-between">
      <h1 className="text-xl">{file['File Code']}</h1>
      <div className="flex">
        <button onClick={() => setPageNumber(pageNumber - 1)} className={'mr-xl' + (pageNumber === 0 && ' hidden')}>
          {'<'}
        </button>
        <span>
          Page {file['Set#']} of {file['Set total']}
        </span>
        <button onClick={() => setPageNumber(pageNumber + 1)} className="mx-l">
          {'>'}
        </button>
      </div>
    </div>
  )
}
export default Header
