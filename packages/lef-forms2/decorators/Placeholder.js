import React from 'react'
import { includes, flip, union, upperCase, get, set } from 'lodash'
import { translatorText } from '../translator'

const PlaceholderDecorator = WrappedComponent => props => {
  set(
    props,
    'element.attributes.placeholder',
    translatorText(
      get(props.element, 'attributes.placeholders'),
      props.translator
    ) || get(props, 'element.attributes.placeholder', '')
  )
  return <WrappedComponent {...props} />
}

const config = ({ translator, model }) => {
  const { languages } = translator || {}
  if (languages) {
    const headerField = [
      {
        key: 'placeholder.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'placeholder.infobox',
        type: 'infobox',
        label: '**Placeholders**',
        layout: { col: { xs: 12 } }
      }
    ]
    const languageFields = languages.map(language => ({
      key: 'placeholder.' + language,
      name: 'attributes.placeholders.' + language,
      type: 'text',
      label: upperCase(language),
      layout: {
        col: { xs: Math.max(3, Math.round(12 / languages.length)) }
      }
    }))
    return headerField.concat(languageFields)
  } else {
    return [
      {
        key: 'placeholder.divider',
        type: 'divider',
        layout: { col: { xs: 12 } }
      },
      {
        key: 'placeholder',
        name: 'attributes.placeholder',
        type: 'text',
        label: 'Placeholder',
        layout: { col: { xs: 12, sm: 6 } }
      }
    ]
  }
}

const filter = key =>
  !includes(
    [
      'select',
      'select-collection',
      'checkbox',
      'checkbox-mc',
      'checkbox-mc-collection',
      'radio',
      'divider',
      'infobox'
    ],
    key
  )
const combine = flip(union)

export default PlaceholderDecorator
export { filter, config, combine }
