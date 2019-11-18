import React from 'react'
import { includes, flip, union } from 'lodash'

const AttributesDecorator = WrappedComponent => props => {
  const { getAttributes } = props
  if (typeof getAttributes !== 'function') {
    return <WrappedComponent {...props} />
  }
  return (
    <WrappedComponent {...props} attributes={getAttributes(props.element)} />
  )
}

const filter = key => !includes(['divider', 'infobox'], key)
const combine = flip(union)

export default AttributesDecorator
export { filter, combine }
