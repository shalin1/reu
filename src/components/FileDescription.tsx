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
    <div className="float-left w-full xl:w-1/6">
      <div className="float-left mr-2 w-1/2 sm:w-1/4 xl:mr-2 xl:w-full">
        <HandMode name={name} />
      </div>
      <div className="text-left text-sm">{description ? <PortableText value={description} /> : props.description}</div>
    </div>
  )
}

export default FileDescription
