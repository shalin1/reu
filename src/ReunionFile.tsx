import React from 'react'
import FileLinks from './FileLinks'

interface Props {
  file?: {
    description: string
    name: string
    num_pages: number
    page: number
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
        <h1 className="text-xl">{file?.name}</h1>
        <div className="flex">
          <button onClick={() => setPageNumber(pageNumber - 1)} className={'mr-xl' + (pageNumber === 0 && 'hidden')}>
            {'<'}
          </button>
          <span>
            Page {file?.page} of {file?.num_pages}
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
