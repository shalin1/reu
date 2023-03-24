import React from 'react'
import { FileMakerProTsvRow } from '../Api'

interface Props {
  file: FileMakerProTsvRow | null
  numPages: number
  pageNumber: number
  setPageNumber: (i: number) => void
}
const Header: React.FC<Props> = ({ file, numPages, setPageNumber, pageNumber }) => {
  const title = file ? file['File Code'] : 'No files found...'
  return (
    <div className="flex justify-between">
      <h1 className="text-xl">{title}&nbsp;</h1>
      <div className="flex">
        {file && (
          <>
            <button onClick={() => setPageNumber(pageNumber - 1)} className={'mr-xl' + (pageNumber === 0 && ' hidden')}>
              {'<'}
            </button>
            <span>
              Page {file['Set#']} of {file['Set total']}
            </span>
            <button onClick={() => setPageNumber(pageNumber + 1)} className="mx-l">
              {'>'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default Header
