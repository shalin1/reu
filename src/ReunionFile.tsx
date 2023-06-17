import React from 'react'
import FileLinks from './components/FileLinks'
import Header from './components/Header'
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
  sanityData: any
  search: (str: string) => void
}

const ReunionFile: React.FC<Props> = ({
  file,
  loading,
  numPages,
  pageNumber,
  nextPage,
  previousPage,
  sanityData,
  search,
}) => {
  if (loading) return <h2>Loading...</h2>
  if (!file) return <h2>File not found.</h2>

  const doc = sanityData.find((doc: any) => doc.title === file['File Code'].trim())
  const description = doc.description
  return (
    <div className="flex flex-col gap-3">
      <Header file={file} numPages={numPages} previousPage={previousPage} nextPage={nextPage} pageNumber={pageNumber} />
      <div className="flex flex-col-reverse gap-3 md:flex-col">
        <FileLinks file={file} search={search} />
        <FileDescription name={file['File Code']} description={description} />
      </div>
    </div>
  )
}

export default ReunionFile
