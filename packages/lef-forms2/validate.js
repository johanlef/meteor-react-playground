import React, { Component } from 'react'
import Ajv from 'ajv'
import { filter, map, set, get, reduce, isObject, isFunction, isEmpty } from 'lodash'

const requiredPaths = elements => map(filter(elements, { required: true }), 'name')

const missingPaths = (doc, elements) => {
  const paths = requiredPaths(elements)
  return reduce(paths, (errors, path) => {
    if (isEmpty(get(doc, path))) { set(errors, path, true) }
    return errors
  }, {})
}
/*
const assembleSchema = elements => {
  const paths = requiredPaths(elements)
  const required = reduce(paths, (acc, path) => set(acc, path, true), {})
  const schema = (obj) => reduce(obj,
    (acc, value, key) => {
      if (isObject(value)) { acc.properties[key] = schema(value) } else { acc.required.push(key) }
      return acc
    }
    ,
    { required: [], properties: {} })
  return schema(required)
}
*/
const validate = WrappedForm =>
  class Validate extends Component {
    constructor (props) {
      super(props)
      this.state = { errors: [], submitted: false }
      this.validate = this.validate.bind(this)
      this.validatedOnStateChange = this.validatedOnStateChange.bind(this)
      this.validatedOnSubmit = this.validatedOnSubmit.bind(this)
    }
    validate (doc) {
      const errors = missingPaths(doc, this.props.elements)
      return errors
    }
    validatedOnStateChange (doc) {
      if (this.state.submitted) { this.setState({ errors: this.validate(doc) }) }
      if (isFunction(this.props.onStateChange)) { return this.props.onStateChange(doc) } else { return doc }
    }
    validatedOnSubmit (doc) {
      this.setState({ submitted: true })
      const errors = this.validate(doc)
      let valid = isEmpty(errors)
      /*
      const schema = assembleSchema(this.props.elements)
      console.log(schema)
      const validate = new Ajv().compile(schema)
      const valid = validate(doc) */
      if (valid && isFunction(this.props.onSubmit)) {
        // this.setState({})
        this.props.onSubmit(doc)
      } else {
        this.setState({ errors })
      }
    }
    render () {
      const { onSubmit, onStateChange, ...xProps } = this.props
      return <WrappedForm
        onSubmit={this.validatedOnSubmit}
        onStateChange={this.validatedOnStateChange}
        errors={this.state.errors}
        {...xProps}
      />
    }
  }

export default validate
