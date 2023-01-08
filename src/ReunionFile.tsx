import React from 'react'
import FileLinks from './FileLinks'
import Header from './Header'

interface Props {
  file?: {
    description: string
    'File Code': string
    'Set total': number
    'Set#': number
  }
  loading: boolean
  numPages: number
  pageNumber: number
  setPageNumber: (i: number) => void
  search: (str: string) => void
}

const ReunionFile: React.FC<Props> = ({ file, loading, numPages, pageNumber, setPageNumber, search }) => {
  if (loading || !file) return <h1>Loading...</h1>

  console.log({ pageNumber, numPages })
  return (
    <>
      <Header file={file} numPages={numPages} setPageNumber={setPageNumber} pageNumber={pageNumber} />
      <FileLinks file={file} search={search} />
      {file.description && <div className="border-solid border-2 border-grey-700">{file.description}</div>}
    </>
  )
}
export default ReunionFile
