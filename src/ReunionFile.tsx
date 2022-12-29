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
  setFileFilter: (i: string) => void
}

const ReunionFile: React.FC<Props> = ({ file, loading, pageNumber, setPageNumber, setFileFilter }) => {
  if (loading) return <h1>Loading...</h1>
  if (!file) return <h1>Try again...</h1>

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl">{file?.name}</h1>
        <div className="flex">
          <div onClick={() => setPageNumber(pageNumber - 1)} className={'mr-xl' + (pageNumber > 0 ? '' : 'hidden')}>
            {'<'}
          </div>
          <span>
            Page {file?.page} of {file?.num_pages}
          </span>
          <div onClick={() => setPageNumber(pageNumber + 1)} className="mx-l">
            {'>'}
          </div>
        </div>
      </div>
      <FileLinks file={file} setFileFilter={setFileFilter} />
      {file.description && <div className="border-solid border-2 border-grey-700">{file.description}</div>}
    </>
  )
}
export default ReunionFile
