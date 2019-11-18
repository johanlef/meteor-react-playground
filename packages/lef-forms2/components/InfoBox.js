import React from 'react'
import { translatorText } from '../translator'

import { upperCase } from 'lodash'

class InfoBoxComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      Text: false
    }
    this.loadFormatter = this.loadFormatter.bind(this)
    // TODO: change this to native 'mardown-it'
    this.loadFormatter('meteor/lef:utils')
  }
  loadFormatter (formatter) {
    import(formatter)
      .then(({ Text }) => this.setState({ Text }))
      .catch(e =>
        console.warn(
          'InfoBox: ',
          e,
          'run "meteor add lef:utils" if this module is missing'
        )
      )
  }
  render () {
    const {
      translator,
      bindInput,
      element,
      attributes: propsAttributes
    } = this.props
    const { attributes: elementAttributes } = element
    const { Text } = this.state
    return (
      <div {...elementAttributes} {...propsAttributes}>
        {Text ? (
          <Text content={translatorText(element.label, translator)} />
        ) : (
          translatorText(element.label, translator)
        )}
      </div>
    )
  }
}

const config = ({ translator, model }) => {
  const { languages } = translator || {}
  if (languages) {
    return languages.map(language => ({
      key: 'infobox.' + language,
      name: 'label.' + language,
      type: 'textarea',
      label: upperCase(language),
      layout: { col: { xs: 12 } },
      attributes: { rows: 4 }
    }))
  } else {
    return [
      {
        name: 'label',
        type: 'textarea',
        key: 'infobox',
        label: 'Text contents',
        attributes: { rows: 5 },
        layout: { col: { xs: 12 } }
      }
    ]
  }
}

export default InfoBoxComponent
export { config }
