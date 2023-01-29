import React, { useEffect, useState } from 'react'

interface Props {
  description: string
  name: string
}

const FileDescription: React.FC<Props> = ({ description, name }) => {
  const imageName = name.split(' ')[1].toLowerCase()
  const src = new URL(`./images/${imageName}.png`, import.meta.url).href

  return (
    <div className="flex">
      <img alt={name} src={src}></img>
      <div className="border-solid border-2 border-grey-700 p-1 px-2 text-left">{description}</div>
    </div>
  )
}

export default FileDescription
