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

  const checkForPrefixes = (name: string) => {
    if (name.includes('breakout')) {
      return 'egg'
    }
    if (name === 'implant trance') {
      return name
    }
    if (name.includes('1-6')) {
      return 'general'
    }
    const prefixes = ['belief', 'implant', 'nutrient', 'seeding', 'alliances', 'demonic', 'circuit', 'code']
    const prefixFound = prefixes.find((prefix) => name.startsWith(prefix))
    return prefixFound || name
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
