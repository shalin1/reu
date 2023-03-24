import React from 'react'
import HandMode from './HandMode'

interface Props {
  description: string
  name: string
}

const FileDescription: React.FC<Props> = ({ description, name }) => {
  return (
    <div className="flex">
      <HandMode name={name} />
      <div className="border-grey-700 border-2 border-solid p-1 px-2 text-left">{description}</div>
    </div>
  )
}

export default FileDescription
