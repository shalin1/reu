import React from 'react'
interface Props {
  name: string
}

const HandMode: React.FC<Props> = ({ name }) => {
  const getAssetSrc = (name: string) => {
    const afterColon = name.split(':')[1] || name
    const withoutParentheses = afterColon.replace(/\s*\(.*?\)\s*/g, '')
    const sanitized = withoutParentheses.trim().toLowerCase()
    const sanitizedWithoutAst = sanitized.replace('*', '')
    const sanitizedWithoutQuote = sanitizedWithoutAst.replace('’', '')
    const sanitizedWithoutFacilitation = sanitizedWithoutQuote.replace(' facilitation', '')
    const dealWithBelief = sanitizedWithoutFacilitation.startsWith('belief') ? 'belief' : sanitizedWithoutFacilitation
    const dealWithImplant = dealWithBelief.startsWith('implant') ? 'implant' : dealWithBelief
    const dealWithNutrient = dealWithImplant.startsWith('nutrient') ? 'nutrient' : dealWithImplant
    const dealWithHelpmode = dealWithNutrient.replace(' helpmode', '')
    const path = `/src/images/${dealWithHelpmode}.png`
    console.log('| ' + path + ' |')
    const modules = import.meta.glob('/src/images/*', { eager: true })
    const mod = modules[path] as { default: string }
    return mod?.default
  }

  return <img alt={name} src={getAssetSrc(name)} />
}
export default HandMode
