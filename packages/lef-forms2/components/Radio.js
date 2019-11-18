import React from 'react'
import { GenericInputNoChildren } from './GenericInput'
import { transformOptions } from './Select'
import { get, upperCase, kebabCase } from 'lodash'
import { translatorText } from '../translator'
import { Random } from 'meteor/random'

const Radio = props => {
  const { translator, bindInput, ...xProps } = props
  return (props.element.options || []).map((option, i) => {
    const optionValue = option._id || option.default || option
    const key = (props.element.key || Random.id()) + i
    xProps.custom = {
      id: key,
      type: 'radio',
      value: optionValue,
      label: translatorText(option, translator),
      checked: get(props.model, props.element.name) == optionValue
    }
    const bindCheckedInput = name => {
      return {
        name,
        checked: get(props.model, name) == optionValue,
        onChange: e =>
          props.setProperty(name, e.target.checked ? optionValue : undefined)
      }
    }
    return (
      <GenericInputNoChildren
        key={key}
        bindInput={bindCheckedInput}
        {...xProps}
      />
    )
  })
}

Radio.displayName = 'Radio'

const config = ({ translator, model }) => {
  const { languages } = translator || {}
  if (languages) {
    const headerField = [
      {
        key: 'radio.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'radio.infobox',
        type: 'infobox',
        label: {
          nl: '**Opties**',
          fr: '**Choix**',
          en: '**Options**'
        },
        layout: { col: { xs: 12 } }
      }
    ]
    const idField = [
      {
        key: 'select.options._id',
        name: 'options._id',
        type: 'textarea',
        label: 'ID (~value)',
        layout: {
          col: { xs: Math.max(3, Math.round(12 / (languages.length + 1))) }
        },
        attributes: {
          rows: 8,
          placeholders: {
            nl: 'Eén optie per lijn',
            fr: 'One item per line',
            en: 'One item per line'
          },
          style: { whiteSpace: 'nowrap' }
        },
        required: true
      }
    ]
    const languageFields = languages.map(language => ({
      key: 'radio.options.' + language,
      name: 'options.' + language,
      type: 'textarea',
      label: upperCase(language),
      layout: {
        col: { xs: Math.max(3, Math.round(12 / (languages.length + 1))) }
      },
      attributes: {
        rows: 8,
        placeholders: {
          nl: 'Eén optie per lijn',
          fr: 'One item per line',
          en: 'One item per line'
        },
        style: { whiteSpace: 'nowrap' }
      },
      required: true
    }))
    return headerField.concat(idField.concat(languageFields))
  } else {
    return [
      {
        key: 'radio.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'radio.options',
        name: 'options',
        type: 'textarea',
        label: {
          nl: 'Opties',
          fr: 'Choix',
          en: 'Options'
        },
        layout: {
          col: { xs: 12 }
        },
        attributes: {
          rows: 8,
          placeholders: {
            nl: 'Eén optie per lijn',
            fr: 'One item per line',
            en: 'One item per line'
          },
          style: { whiteSpace: 'nowrap' }
        },
        required: true
      }
    ]
  }
}

const transform = (element, { translator }, saving) => {
  if (element.options) {
    const result = transformOptions(element.options, translator || {}, saving)
    element.options = result
  }
  if (saving) element.custom = true
  else delete element.custom
  return element
}

export default Radio
export { config, transform }
