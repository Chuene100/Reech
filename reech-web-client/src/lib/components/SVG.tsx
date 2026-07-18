import React from 'react'
import RCSVG from 'react-inlinesvg'
import {toAbsoluteUrl} from '../AssetHelpers'
type Props = {
  className?: string
  path: string
  svgClassName?: string
}

const SVG: React.FC<Props> = ({className = '', path, svgClassName = 'mh-50px'}) => {
  return (
    <span className={`svg-icon ${className}`}>
      <RCSVG src={toAbsoluteUrl(path)} className={svgClassName} />
    </span>
  )
}

export {SVG}
