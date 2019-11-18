import React from 'react'
import GenericInput from './GenericInput'
import {
  isArray,
  isString,
  isPlainObject,
  upperCase,
  fromPairs,
  forEach,
  reduce,
  kebabCase,
  includes,
  assign,
  size
} from 'lodash'
import { translatorText } from '../translator'

const Select = props => {
  const { element, translator } = props
  const options = element.options || []
  // if (get(element, 'attributes.multiple', false) == 'checkbox') {
  //   return <SelectMulti {...props} />
  // } else {
  const hasEmptyOption = isArray(options)
    ? options.find(option => !option || !option._id || option._id == '~')
    : !options
  return (
    <GenericInput {...props}>
      {!hasEmptyOption ? (
        <option key={`${element.name}-option-default`} value={''}>
          {'–'}
        </option>
      ) : null}
      {options.map((option, index) => (
        <option
          key={`${element.name}${element.key}-option-${index}`}
          value={option._id}
        >
          {translatorText(option, translator)}
        </option>
      ))}
    </GenericInput>
  )
  // }
}

const config = ({ translator }) => {
  const { languages } = translator || {}
  if (languages) {
    const headerField = [
      {
        key: 'select.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'select.infobox',
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
      key: 'select.options.' + language,
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
        key: 'select.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'select.options',
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

/* Transformation of options
 * To make it easier to fill options (newlines in textarea),
 * these need to be transformed before saving or retrieving.
 */

const transformOptions = (defaultOptions, translator, saving) => {
  const optionDelimiter = '\n'
  const optionId = value => '~' + kebabCase(value)
  const { languages, currentLanguage } = translator
  if (isString(defaultOptions) && saving) {
    if (languages) {
      /* 'nl\nnl2' => [{_id:'~nl',nl:'nl','en':'nl'},{_id:'~nl2',nl:'nl2','en':'nl2'}] */
      return defaultOptions
        .split(optionDelimiter)
        .map(option =>
          assign(
            { _id: optionId(option) },
            fromPairs(languages.map(l => [l, option]))
          )
        )
    } else {
      /* 'nl\nnl2' => [{_id:'~nl',default:'nl'},{_id:'~nl2',default:'nl2'}] */
      return defaultOptions.split(optionDelimiter).map(option => ({
        _id: optionId(option),
        [currentLanguage || 'default']: option
      }))
    }
  } else if (isPlainObject(defaultOptions) && saving) {
    /* {nl:'nl\nnl2',en:'en\nen2'} => [{_id:'~nl',nl:'nl',en:'en'},{_id:'~nl2',nl:'nl2',en:'en2'}] */
    const reducer = (result, options, lang) => {
      options.split(optionDelimiter).map((option, key) => {
        if (!result[key]) result[key] = {}
        result[key][lang] = lang == '_id' ? optionId(option) : option
      })
      return result
    }
    return reduce(defaultOptions, reducer, [])
  } else if (isArray(defaultOptions) && !saving) {
    /* [{_id:'~nl',nl:'nl',en:'en'},{_id:'~nl2',nl:'nl2',en:'en2'}] => {nl:'nl\nnl2',en:'en\nen2'} */
    const excludeKeys = ['default']
    const reducer = (result, option) => {
      forEach(option, (o, lang) => {
        if (!includes(excludeKeys, lang)) {
          if (result[lang]) result[lang] += '\n' + o
          else result[lang] = o
        }
      })
      if (size(option) && !size(result)) {
        result = translatorText(option, translator)
      }
      return result
    }
    return defaultOptions.reduce(reducer, {})
  } else return defaultOptions
}

const transform = (element, { translator }, saving) => {
  if (element.options) {
    const result = transformOptions(element.options, translator || {}, saving)
    element.options = result
  }
  return element
}

export default Select

export { config, transform }
export { transformOptions }
