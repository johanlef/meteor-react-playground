import React from 'react'
import { includes, flip, union } from 'lodash'

const NameDecorator = WrappedComponent => props => {
  return <WrappedComponent {...props} />
}

const filter = key => !includes(['divider', 'infobox'], key)
const combine = flip(union)

const config = ({ translator, model }) => [
  {
    key: 'name',
    name: 'name',
    type: 'text',
    label: 'Field identifier',
    attributes: {
      placeholder: 'Technical name for field'
    },
    required: true,
    layout: { col: { xs: 12, sm: 6 } }
  }
]

export default NameDecorator
export { filter, config, combine }
