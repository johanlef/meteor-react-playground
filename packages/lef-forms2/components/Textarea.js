import React from 'react'
import { GenericInputNoChildren } from './GenericInput'
import { MarkdownImageUpload } from 'meteor/lef:imgupload'
import { get } from 'lodash'
import { MarkdownHelp } from 'meteor/lef:translations'

const Textarea = props => {
  const onUrl = url => {
    props.setProperty(
      props.element.name,
      `${get(props.model, props.element.name)}\n${url}`
    )
  }
  return (
    <>
      <GenericInputNoChildren {...props} />
      {props.element.md ? (
        <>
          <MarkdownHelp />
          <MarkdownImageUpload onSubmit={onUrl} />
        </>
      ) : null}
    </>
  )
}

const config = ({translator, model}) => [
  {
    key: 'textarea.divider',
    type: 'divider',
    layout: { col: { xs: 12 } }
  },
  {
    key: 'textarea.rows',
    name: 'attributes.rows',
    type: 'text',
    label: 'Size',
    attributes: {
      placeholders: {
        nl: 'Aantal lijnen, bv. 5',
        fr: 'Combien de lignes, ex. 5',
        en: 'Number of lines, e.g. 5',
      }
    },
    layout: { col: { xs: 6, md: 4 } },
  }
]

export default Textarea
export { config }
