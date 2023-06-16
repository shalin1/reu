import React from 'react'
import FileLinks from './components/FileLinks'
import Header from './components/Header'
import useFiles from './hooks/useFiles'
import FileDescription from './components/FileDescription'
import SanityFileDescription from './components/SanityFileDescription'

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
  showSearch: () => void
}

const ReunionFile: React.FC<Props> = ({ file, numPages, pageNumber, nextPage, previousPage, showSearch, search }) => {
  const { loading } = useFiles()
  if (loading) return <h1>Loading...</h1>
  if (!file) return <h2>No file found...</h2>

  return (
    <div className="flex flex-col gap-3">
      <Header
        showSearch={showSearch}
        file={file}
        numPages={numPages}
        previousPage={previousPage}
        nextPage={nextPage}
        pageNumber={pageNumber}
      />
      <div className="flex flex-col-reverse gap-3 md:flex-col">
        <FileLinks file={file} search={search} />
        <FileDescription name={file['File Code']} description={file.Information} />
      </div>
    </div>
  )
}

export default ReunionFile
