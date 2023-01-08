import React from 'react'
import FileLinks from './FileLinks'

interface Props {
  file?: {
    description: string
    'File Code': string
    'Set total': number
    'Set#': number
  }
  loading: boolean
  pageNumber: number
  setPageNumber: (i: number) => void
  search: (str: string) => void
}

const ReunionFile: React.FC<Props> = ({ file, loading, pageNumber, setPageNumber, search }) => {
  if (loading || !file) return <h1>Loading...</h1>

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl">{file['File Code']}</h1>
        <div className="flex">
          <button onClick={() => setPageNumber(pageNumber - 1)} className={'mr-xl' + (pageNumber === 0 && 'hidden')}>
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
      <FileLinks file={file} search={search} />
      {file.description && <div className="border-solid border-2 border-grey-700">{file.description}</div>}
    </>
  )
}
export default ReunionFile
