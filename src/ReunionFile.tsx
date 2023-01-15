import React from 'react'
import FileLinks from './FileLinks'
import Header from './Header'
import { useFiles } from './Api'

interface Props {
  file?: {
    description: string
    'File Code': string
    Information: string
    'Set total': number
    'Set#': number
  }
  loading: boolean
  numPages: number
  pageNumber: number
  setPageNumber: (i: number) => void
  search: (str: string) => void
}

const ReunionFile: React.FC<Props> = ({ file, numPages, pageNumber, setPageNumber, search }) => {
  const { loading } = useFiles()
  if (loading) return <h1>Loading...</h1>

  return (
    <>
      <Header file={file} numPages={numPages} setPageNumber={setPageNumber} pageNumber={pageNumber} />
      <FileLinks file={file} search={search} />
      {file && file['Information'] && (
        <div className="border-solid border-2 border-grey-700 p-1 px-2 text-left">{file['Information']}</div>
      )}
    </>
  )
}
export default ReunionFile
