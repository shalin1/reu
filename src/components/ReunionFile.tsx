import React, { useState } from 'react'
import FileLinks from './FileLinks'
import Header from './Header'
import useFiles from '../hooks/useFiles'
import FileDescription from './FileDescription'
import useSanity from '../hooks/useSanity'

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
}

const ReunionFile: React.FC<Props> = ({ file, numPages, pageNumber, nextPage, previousPage, showSearch, search }) => {
  const { sanityData } = useSanity()
  const [flipped, setFlipped] = useState(false)
  const { loading } = useFiles()

  if (loading || !file) return <h1>Loading...</h1>
  const sanityFile = sanityData?.find((doc: any) => doc.title === file['File Code'].trim())
  const description = sanityFile?.description
  console.log(sanityFile)
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

  const flipIt = () => {
    setFlipped(!flipped)
  }

  return (
    <div className="flex flex-col gap-3">
      <Header
        flipIt={flipIt}
        showSearch={showSearch}
        file={file}
        numPages={numPages}
        previousPage={previousPage}
        nextPage={nextPage}
        pageNumber={pageNumber}
      />
      <div className={`flex ${flipped ? 'flex-col-reverse' : 'flex-col'} gap-3`}>
        <FileLinks file={file} sanityFile={sanityFile} search={search} />
        <FileDescription name={file['File Code']} description={description} />
      </div>
    </div>
  )
}

export default ReunionFile
