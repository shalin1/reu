import React from 'react'
import HandMode from './HandMode'
import { PortableText } from '@portabletext/react'

interface Props {
  name: string
  description: any
}

const FileDescription: React.FC<Props> = ({ name, description }) => {
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
