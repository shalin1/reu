import React from 'react'
import { FileMakerProTsvRow } from '../hooks/useFiles'

interface Props {
  file: FileMakerProTsvRow | null
  flipIt: () => void
  numPages: number
  pageNumber: number
  nextPage: () => void
  previousPage: () => void
  showSearch: () => void
}
const Header: React.FC<Props> = ({ file, flipIt, numPages, nextPage, previousPage, pageNumber, showSearch }) => {
  const title = file ? file['File Code'] : 'No files found...'
  const isLastPage = pageNumber + 1 >= numPages
  return (
    <div className="border-grey-700 flex justify-between border-2 border-solid p-1 px-2">
      <h1 className="text-xl" onClick={showSearch}>
        {title}&nbsp;
      </h1>

      <button onClick={flipIt} className="w-64 border-2 bg-newsprint-pink ">
        flip description and links
      </button>
      <div className="flex">
        {file && (
          <>
            <button onClick={previousPage} className={'mr-xl' + (pageNumber === 0 ? ' hidden' : '')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className={isLastPage ? 'mr-5' : ''}>
              Page {file['Set#']} of {file['Set total']}
            </span>
            <button onClick={nextPage} className={'mx-l' + (isLastPage ? ' hidden' : '')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default Header
