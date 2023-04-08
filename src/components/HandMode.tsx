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
    const santizedWithoutFacilitation = sanitizedWithoutColon.replace(' facilitation', '')
    const dealWithBelief = santizedWithoutFacilitation.startsWith('belief') ? 'belief' : santizedWithoutFacilitation
    const path = `/src/images/${dealWithBelief}.png`
    console.log('| ' + path + ' |')
    const modules = import.meta.glob('/src/images/*', { eager: true })
    const mod = modules[path] as { default: string }
    return mod?.default
  }

  return <img alt={name} src={getAssetSrc(name)} />
}
export default HandMode
