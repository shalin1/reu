import React from 'react'
import { FileMakerProTsvRow } from '../Api'

interface Props {
  file: FileMakerProTsvRow | null
  numPages: number
  pageNumber: number
  nextPage: () => void
  previousPage: () => void
  showSearch: () => void
}
const Header: React.FC<Props> = ({ file, numPages, nextPage, previousPage, pageNumber, showSearch }) => {
  const title = file ? file['File Code'] : 'No files found...'
  return (
    <div className="border-grey-700 flex justify-between border-2 border-solid p-1 px-2">
      <h1 className="text-xl" onClick={showSearch}>
        {title}&nbsp;
      </h1>
      <div className="flex">
        {file && (
          <>
            <button onClick={nextPage} className={'mr-xl' + (pageNumber === 0 && ' hidden')}>
              {'<'}
            </button>
            <span>
              Page {file['Set#']} of {file['Set total']}
            </span>
            <button onClick={previousPage} className={'mx-l' + (pageNumber + 1 >= numPages && ' hidden')}>
              {'>'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default Header
