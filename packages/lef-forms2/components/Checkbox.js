import React from 'react'
import { GenericInputNoChildren } from './GenericInput'
import { get, upperCase, kebabCase } from 'lodash'
import { translatorText } from '../translator'

const Checkbox = props => {
  const { bindInput, ...xProps } = props
  xProps.checked = get(props.model, props.element.name, false)
  const bindCheckedInput = name => {
    return {
      name,
      checked: get(props.model, name, false),
      onChange: e => props.setProperty(name, e.target.checked)
    }
  }
  if (get(xProps, 'value', '')) {
    xProps.value = translatorText(xProps.value, translator)
  }
  return <GenericInputNoChildren {...xProps} bindInput={bindCheckedInput} />
}

Checkbox.displayName = 'Checkbox'

const transform = (element, { translator }, saving) => {
  if (element.label) {
    element.value = `~${kebabCase(
      translatorText(element.label, translator, true)
    )}`
  }
  return element
}

export default Checkbox
export { transform }
