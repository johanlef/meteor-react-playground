import React, { Component } from 'react'
import { Form, Row } from 'reactstrap'
import { get, set } from 'lodash'

const renderElements = (element, library, additionalProps, index) => {
  if (library.has(element.type)) {
    let Component = library.get(element.type).component
    const key = `${element.name}${element.key || index}`
    if (get(additionalProps, 'readOnly')) {
      set(element, 'attributes.disabled', true)
    }
    return <Component key={key} element={element} {...additionalProps} />
  } else {
    console.log(
      `Unknown element type: ${element.type}`,
      get(element, 'name', index)
    )
    return null
  }
}

class FormComposer extends Component {
  constructor (props) {
    super(props)
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    this.props.onSubmit(this.props.model)
  }
  renderElements (props) {
    const { elements, library, ...additionalProps } = props
    return elements.map((element, index) =>
      renderElements(element, library, additionalProps, index)
    )
  }
  render () {
    const { formAttributes } = this.props
    return (
      <Form onSubmit={this._onSubmit} {...formAttributes}>
        <Row>{this.renderElements(this.props)}</Row>
        {this.props.children}
      </Form>
    )
  }
}

export { FormComposer }
