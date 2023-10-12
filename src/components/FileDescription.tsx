import React from 'react'
import HandMode from './HandMode'
import useSanity from '../hooks/useSanity'
import { PortableText } from '@portabletext/react'

interface Props {
  description: string
  name: string
}

const FileDescription: React.FC<Props> = (props) => {
  const { name } = props
  const { data } = useSanity()
  const doc = data?.find((doc: any) => doc.title === name.trim())
  const description = doc?.description

  return (
    <div className="float-left w-full">
      <div className="float-left mr-2 w-1/2 sm:w-44 ">
        <HandMode name={name} />
      </div>
      <div className="text-left text-xs">
        <PortableText value={description} />
      </div>
    </div>
  )
}

export default FileDescription
