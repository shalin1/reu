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
    const replaced = sanitized.replace(/[*’]| facilitation| helpmode| opening|facilitator\//g, '')
    return replaced
  }

  const nameMap: { [key: string]: string } = {
    // 'seeding source': 'seeding',
    // Add any other transformations here as key-value pairs
  }

  const checkForPrefixes = (name: string) => {
    const prefixes = ['belief', 'implant', 'nutrient', 'seeding', 'alliances', 'demonic', 'circuit', 'code']
    const prefixFound = prefixes.find((prefix) => name.startsWith(prefix))
    return prefixFound || name
  }

  const getAssetSrc = (name: string) => {
    const sanitized = sanitizeName(name)
    const replacedName = Object.prototype.hasOwnProperty.call(nameMap, sanitized) ? nameMap[sanitized] : sanitized
    const finalName = checkForPrefixes(replacedName)
    console.log(finalName)
    const path = `/src/images/${finalName}.png`
    const modules = import.meta.glob('/src/images/*', { eager: true })
    const mod = modules[path] as { default: string }
    return mod?.default
  }

  return <img className="w-full" alt={name} src={getAssetSrc(name)} />
}

export default HandMode
