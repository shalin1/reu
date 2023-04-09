import React from 'react'
import HandMode from './HandMode'

interface Props {
  description: string
  name: string
}

const FileDescription: React.FC<Props> = ({ description, name }) => {
  return (
    <div className="flex">
      <div className="mr-2 w-1/5">
        <HandMode name={name} />
      </div>
      <div className="w-4/5">
        <div className="border-grey-700 border-2 border-solid p-1 px-2 text-left">{description}</div>
      </div>
    </div>
  )
}

export default FileDescription
