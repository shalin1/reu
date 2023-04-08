import React from 'react'
import Acceptance from '../images/*acceptance.png'
interface Props {
  name: string
}

const HandMode: React.FC<Props> = ({ name }) => {
  const getAssetSrc = (name: string) => {
    const sanitized = name.trim().toLowerCase()
    const sanitizedWithoutAst = sanitized.replace('*', '')
    const sanitizedWithoutColon = sanitizedWithoutAst.replace(':', '')
    const path = `/src/images/${sanitizedWithoutColon}.png`
    console.log('*' + path + '*')
    const modules = import.meta.glob('/src/images/*', { eager: true })
    console.log(modules)
    const mod = modules[path] as { default: string }
    console.log(mod)
    return mod?.default
  }

  return <img alt={name} src={getAssetSrc(name)} />
}
export default HandMode
