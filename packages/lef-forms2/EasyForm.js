import React from 'react'
import reformed from './reformed'
import validate from './validate'
import ComponentLibrary from './Components'
import DecoratorLibrary from './Decorators'
import { FormComposer } from './FormComposer'
import { FormEditor } from './FormEditor'
import { isEmpty, set } from 'lodash'

class EasyForm {
  constructor ({
    library = ComponentLibrary,
    decorators = DecoratorLibrary
  } = {}) {
    this.library = library
    this.decorators = decorators
  }
  addComponent (name, component) {
    if (this.library.has(name)) {
      console.log(`Warning: Replacing default ${name} component`)
    }
    this.library.set(name, component)
  }
  removeComponent (name) {
    this.library.delete(name)
  }
  addDecorator (name, decorator) {
    if (this.decorators.has(name)) {
      console.log(`Warning: Replacing default ${name} decorator`)
    }
    this.decorators.set(name, decorator)
  }
  removeDecorator (name) {
    this.decorators.delete(name)
  }
  modifyLibrary (config) {
    const decorators = isEmpty(config.decorators)
      ? this.decorators
      : this.decorators.subset(config.decorators)
    const components = isEmpty(config.components)
      ? this.library.clone()
      : this.library.subset(config.components)
    decorators.apply(components, config)
    return components
  }
  instance (config = {}) {
    const ReformedFormComposer = validate(
      reformed(config.middleware)(FormComposer)
    )
    return props => {
      set(config, 'translator', props.translator)
      const components = this.modifyLibrary(config)
      return (
        <ReformedFormComposer library={components} {...props}>
          {props.readOnly ? null : props.children}
        </ReformedFormComposer>
      )
    }
  }
  editor (config = {}) {
    return props => {
      set(config, 'translator', props.translator)
      const components = this.modifyLibrary(config)
      return (
        <FormEditor library={components} {...props}>
          {props.children}
        </FormEditor>
      )
    }
  }
}

export { EasyForm }
