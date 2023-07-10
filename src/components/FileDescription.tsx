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
    <div className="w-1/3 lg:w-1/4 xl:w-1/5">
      <div className="float-left mb-1 w-full p-2">
        <HandMode name={name} />
      </div>
      <div className="border-grey-700 border-2 border-solid p-2 text-left text-sm">
        {description ? <PortableText value={description} /> : props.description}
      </div>
    </div>
  )
}

export default FileDescription
