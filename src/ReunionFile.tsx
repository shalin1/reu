import React from 'react'
import FileLinks from './components/FileLinks'
import Header from './components/Header'
import { useFiles } from './Api'
import FileDescription from './components/FileDescription'

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
  nextPage: () => void
  previousPage: () => void
  search: (str: string) => void
}

const ReunionFile: React.FC<Props> = ({ file, numPages, pageNumber, nextPage, previousPage, search }) => {
  const { loading } = useFiles()
  if (loading) return <h1>Loading...</h1>
  if (!file) return <h2>No file found...</h2>

  return (
    <div className="flex flex-col gap-2">
      <Header file={file} numPages={numPages} previousPage={previousPage} nextPage={nextPage} pageNumber={pageNumber} />
      <FileLinks file={file} search={search} />
      <FileDescription name={file['File Code']} description={file.Information} />
    </div>
  )
}

export default ReunionFile
