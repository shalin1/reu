import React from 'react'
import FileLinks from './FileLinks'
import Header from './Header'
import useFiles from '../hooks/useFiles'
import FileDescription from './FileDescription'

interface Props {
  file: {
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
  sanityData: any[] | undefined
}

const ReunionFile: React.FC<Props> = ({
  sanityData,
  file,
  numPages,
  pageNumber,
  nextPage,
  previousPage,
  showSearch,
  search,
}) => {
  const { loading } = useFiles()

  if (loading || !sanityData) return <h1>Loading...</h1>

  if (!file) {
    return (
      <div className="align-center flex flex-col justify-center">
        <h2>No file found...</h2>
        <button
          className="rounded-lg border-2 border-gray-400 px-4 py-2 text-lg text-sm font-medium text-black "
          onClick={showSearch}
        >
          Search again?
        </button>
      </div>
    )
  }

  const sanityFile = sanityData.find((doc: any) => doc.title === file['File Code'].trim())
  const description = sanityFile?.description
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
        <FileLinks file={file} sanityFile={sanityFile} search={search} />
        <FileDescription name={file['File Code']} description={description} />
      </div>
    </div>
  )
}

export default ReunionFile
