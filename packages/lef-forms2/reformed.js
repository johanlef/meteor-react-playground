import React from 'react'
import PropTypes from 'prop-types'
import assign from 'object-assign'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { set, get, identity, isFunction } from 'lodash'

class ModelHandlerWrapper {
  constructor ({ getState, setState, onStateChange }) {
    this.getState = getState
    this.setState = setState
    this.onStateChange = onStateChange
  }
  setModel = model => {
    model = this.onStateChange(model)
    this.setState({ model })
    return model
  }
  getModel = () => this.getState('model')
  getModelValue = name => get(this.getModel(), name)
  setModelValue = (name, value) => {
    return this.setModel(set(this.getModel(), name, value))
  }
}

const makeWrapper = middleware => WrappedComponent => {
  class FormWrapper extends React.Component {
    static propTypes = {
      initialModel: PropTypes.object
    }

    constructor (props, ctx) {
      super(props, ctx)
      this.state = {
        model: props.initialModel || {}
      }
    }

    makeHelpers = modelHandler => {
      bindToChangeEvent = e => {
        const { name, type, value } = e.target
        modelHandler.setModelValue(name, value)
      }
      helpers = {
        setModel: model => modelHandler.setModel(model),
        setProperty: (prop, value) => modelHandler.setModelValue(prop, value),
        bindToChangeEvent: bindToChangeEvent,
        bindInput: name => {
          return {
            name,
            value: modelHandler.getModelValue(name) || '',
            onChange: bindToChangeEvent
          }
        }
      }
      return helpers
    }

    render () {
      const getState = name => this.state[name]
      const onStateChange = isFunction(this.props.onStateChange)
        ? this.props.onStateChange
        : identity
      let modelHandler = new ModelHandlerWrapper({
        getState: getState,
        setState: this.setState.bind(this),
        onStateChange
      })
      if (typeof middleware === 'function') {
        modelHandler = middleware(modelHandler)
      }
      let nextProps = assign(
        {},
        this.props,
        {
          model: modelHandler.getModel()
        },
        this.makeHelpers(modelHandler)
      )
      return React.createElement(WrappedComponent, nextProps)
    }
  }

  FormWrapper.displayName = `Reformed(${getComponentName(WrappedComponent)})`
  return hoistNonReactStatics(FormWrapper, WrappedComponent)
}

const getComponentName = component => component.displayName || component.name

export default makeWrapper
