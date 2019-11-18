import React from 'react'
import { FormFeedback } from 'reactstrap'
import { get, includes, upperCase } from 'lodash'
import {translatorText} from '../translator'

const Validate = WrappedComponent => props => {
  if (get(props.errors, props.element.name)) {
    let { attributes, ...xProps } = props
    attributes = attributes || {}
    const { description } = props.element.schema || {}
    attributes.invalid = true
    return (
      <>
        <WrappedComponent {...xProps} attributes={attributes} />
        {description ? <FormFeedback>{translatorText(description, props.translator)}</FormFeedback> : null}
      </>
    )
  } else {
    return <WrappedComponent {...props} />
  }
}

const config = ({ translator, model }) => [
  {
    key: 'validate.divider',
    type: 'divider',
    layout: { col: { xs: 12 } }
  },
  {
    key: 'validate.infobox',
    type: 'infobox',
    label: {
      en: '**Validation**',
      nl: '**Validatie**'
    },
    layout: { col: { xs: 12 } }
  },
  {
    key: 'validate.required',
    name: 'required',
    type: 'checkbox',
    label: {
      en: 'Field is required',
      nl: 'Verplicht veld',
      translate: 'fieldIsRequired',
    },
    layout: { col: { xs: 12 } }
  }
].concat(get(translator,'languages',[]).map((lang, i, languages) => ({
  key: 'validate.description.'+lang,
  name: 'schema.description.'+lang,
  type: 'text',
  label: upperCase(lang),
  layout: { col: {xs: 12, sm: Math.max(6, 12 / languages.length), md: Math.max(4, 12 / languages.length)}},
  attributes: {
    placeholders: {
      nl: 'Uitleg waarom ongeldig',
      fr: 'Explanation d’invalidité',
      en: 'Explain why invalid'
    }
  }
})))

const filter = key => !includes(['divider', 'infobox'], key)

export default Validate
export { config, filter }
