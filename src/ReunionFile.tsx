import React from 'react'
import FileLinks from './FileLinks'
import Header from './Header'
import { useFiles } from './Api'
import FileDescription from './FileDescription'

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
  if (!file) return <h2>No file found...</h2>

  return (
    <>
      <Header file={file} numPages={numPages} setPageNumber={setPageNumber} pageNumber={pageNumber} />
      <FileLinks file={file} search={search} />
      <FileDescription name={file['File Code']} description={file.Information} />
    </>
  )
}

export default ReunionFile
