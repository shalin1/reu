import React, { useEffect } from 'react'
import HandMode from './HandMode'
import useSanity from '../hooks/useSanity'
import { PortableText } from '@portabletext/react'

interface Props {
  description: string
  name: string
}

const FileDescription: React.FC<Props> = (props) => {
  const { name } = props
  const { sanityData } = useSanity()
  const doc = sanityData?.find((doc: any) => doc.title === name.trim())
  const description = doc?.description

  return (
    <div className="flex">
      <div className="mr-2 w-1/3 md:w-1/5">
        <HandMode name={name} />
      </div>
      <div className="w-2/3 md:w-4/5">
        <div className="border-grey-700 border-2 border-solid p-1 px-2 text-left">
          {description ? <PortableText value={description} /> : props.description}
        </div>
      </div>
    </div>
  )
}

export default FileDescription
