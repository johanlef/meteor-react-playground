import React from 'react'
import { Input, CustomInput } from 'reactstrap'
import { set, get, castArray, includes } from 'lodash'

const GenericInput = ({ bindInput, element, attributes, children, custom }) => {
  const { key, name, type, attributes: elementAttributes } = element
  const { id, label, value, checked } = custom || {}
  if (get(elementAttributes, 'multiple', false)) {
    console.warn(
      '“Multiple” is not supported on elements. Use “checkbox-mc” instead.'
    )
    return null
  }
  const Tag = custom ? CustomInput : Input
  return (
    <Tag
      type={type}
      {...custom}
      {...bindInput(name)}
      {...elementAttributes}
      {...attributes}
    >
      {children}
    </Tag>
  )
}

const GenericInputNoChildren = ({ bindInput, element, attributes, custom }) => {
  const { key, name, type, attributes: elementAttributes } = element
  const { id, label, value, checked } = custom || {}
  const Tag = custom ? CustomInput : Input
  return (
    <Tag
      type={type}
      {...custom}
      {...bindInput(name)}
      {...elementAttributes}
      {...attributes}
    />
  )
}

GenericInput.displayName = 'Input'
GenericInputNoChildren.displayName = 'Input'

const config = ({ translator, model }) => []

export default GenericInput
export { config, GenericInputNoChildren }
