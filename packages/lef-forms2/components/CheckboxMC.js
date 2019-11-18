import React from 'react'
import { GenericInputNoChildren } from './GenericInput'
import { transformOptions } from './Select'
import { get, upperCase, kebabCase, includes } from 'lodash'
import { translatorText } from '../translator'
import { Random } from 'meteor/random'

const CheckboxMC = props => {
  const { translator, bindInput, ...xProps } = props
  const thisModel = get(props.model, props.element.name, [])
  return (props.element.options || []).map((option, i) => {
    const optionValue = option._id || option.default || option
    const key = (props.element.key || Random.id()) + i
    xProps.custom = {
      id: key,
      type: 'checkbox',
      value: optionValue,
      label: translatorText(option, translator),
      checked: includes(thisModel, optionValue)
    }
    const bindCheckedInput = name => ({
      name,
      checked: includes(thisModel, optionValue),
      onChange: e => {
        if (e.target.checked) {
          thisModel.push(optionValue)
          return props.setProperty(name, thisModel)
        } else {
          props.setProperty(name, thisModel.filter(o => o !== optionValue))
        }
      }
    })
    return (
      <GenericInputNoChildren
        key={key}
        bindInput={bindCheckedInput}
        {...xProps}
      />
    )
  })
  const bindCheckedInput = name => {
    return {
      name,
      label: translatorText(props.value),
      checked: get(props.model, name),
      onChange: e => props.setProperty(name, e.target.checked)
    }
  }
  if (get(xProps, 'value', '')) {
    xProps.value = translatorText(xProps.value, translator)
  }
  return <GenericInputNoChildren {...xProps} bindInput={bindCheckedInput} />
}

CheckboxMC.displayName = 'CheckboxMC'

const config = ({ translator, model }) => {
  const { languages } = translator || {}
  if (languages) {
    const headerField = [
      {
        key: 'select-mc.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'select-mc.infobox',
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
        key: 'select-mc.options._id',
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
      key: 'select-mc.options.' + language,
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
        key: 'select-mc.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'select-mc.options',
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

export default CheckboxMC
export { config, transform }
