import React from 'react'

interface Props {
  name: string
}

const HandMode: React.FC<Props> = ({ name }) => {
  const sanitizeName = (name: string) => {
    const afterColon = name.split(':')[1] || name
    const sanitized = afterColon
      .replace(/\s*\(.*?\)\s*/g, '')
      .trim()
      .toLowerCase()
    return sanitized.replace(/[*’]| facilitation| helpmode/g, '')
  }

  const checkForPrefixes = (name: string) => {
    const prefixes = ['belief', 'implant', 'nutrient']
    return prefixes.some((prefix) => name.startsWith(prefix))
      ? prefixes.find((prefix) => name.startsWith(prefix))
      : name
  }

  const getAssetSrc = (name: string) => {
    const sanitized = sanitizeName(name)
    const finalName = checkForPrefixes(sanitized)
    const path = `/src/images/${finalName}.png`
    const modules = import.meta.glob('/src/images/*', { eager: true })
    const mod = modules[path] as { default: string }
    return mod?.default
  }

  return <img className="w-full" alt={name} src={getAssetSrc(name)} />
}

export default HandMode
