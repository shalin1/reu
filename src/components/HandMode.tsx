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
    const sanitizedWithoutFacilitation = sanitizedWithoutColon.replace(' facilitation', '')
    const dealWithBelief = sanitizedWithoutFacilitation.startsWith('belief') ? 'belief' : sanitizedWithoutFacilitation
    const dealWithHelpmode = dealWithBelief.replace(' helpmode', '')
    const path = `/src/images/${dealWithHelpmode}.png`
    console.log('| ' + path + ' |')
    const modules = import.meta.glob('/src/images/*', { eager: true })
    const mod = modules[path] as { default: string }
    return mod?.default
  }

  return <img alt={name} src={getAssetSrc(name)} />
}
export default HandMode
