import React, { Component } from 'react'
import { Random } from 'meteor/random'
import { FormComposer } from '../FormComposer'
import reformed from '../reformed'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardHeader,
  UncontrolledCollapse
} from 'reactstrap'
import { size, get, flow, find, upperCase, upperFirst, isString } from 'lodash'
import { translatorText } from '../translator'

class ElementEditor extends Component {
  constructor (props) {
    super(props)
    // insert middleware into reformed
    // to intercept the setModel call
    // to push model state
    // up the hierarchy:
    this.middleware = modelHandler => {
      modelHandler.setModel = flow([
        modelHandler.setModel,
        this.props.setElement
      ])
      return modelHandler
    }
    this.ElementForm = reformed(this.middleware)(FormComposer)
  }
  render () {
    return <this.ElementForm {...this.props} />
  }
}

class EditorCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState(prevstate => ({ isOpen: !prevstate.isOpen }))
  }
  shouldComponentUpdate (nextProps, nextState) {
    // performance gets really bad when not doing this!
    // return JSON.stringify(this.props) != JSON.stringify(nextProps)
    if (nextState.isOpen !== this.state.isOpen) return true
    return false
  }
  render () {
    const {
      library,
      index,
      element,
      elements,
      setElementModel,
      onRemove,
      onMoveElement,
      onDuplicate,
      canMove
    } = this.props
    const toggle = `toggle-element-${index}-${element.type}`
    const has = (element, field) => !!find(element, e => e.name == field)
    const dependentOn = get(element, 'dependent.on')
    // retrieve translate key first
    // because wo do not want to lag the form builder with translations
    let label =
      get(
        element,
        'label.translate',
        translatorText(element.label, this.props.translator)
      ) || upperFirst(element.type)
    if (isString(label)) {
      label = label.split('\n')[0]
      if (size(label) > 64) {
        label = label.substr(0, 50) + '…'
      }
    }
    return (
      <Card
        style={{ margin: '1rem 0', marginLeft: dependentOn ? '1rem' : '0' }}
      >
        <CardHeader>
          <ButtonGroup className={'float-right'} style={{ zIndex: 20 }}>
            <Button
              outline
              color={'danger'}
              title={'Remove Element'}
              onClick={() => onRemove(element)}
            >
              ✕
            </Button>
            <Button
              outline
              color={'success'}
              title={'Duplicate Element'}
              onClick={() => onDuplicate(element)}
            >
              ⧉
            </Button>
            <Button
              outline
              color={'info'}
              title={'Move Element Up'}
              onClick={() => onMoveElement(element, -1)}
              disabled={!canMove(index, -1)}
            >
              △
            </Button>
            <Button
              outline
              color={'info'}
              title={'Move Element Down'}
              onClick={() => onMoveElement(element, 1)}
              disabled={!canMove(index, 1)}
            >
              ▽
            </Button>
          </ButtonGroup>
          <CardTitle
            id={toggle}
            style={{ cursor: 'pointer' }}
            onClick={this.toggle}
          >
            {label || <em>_label</em>}
          </CardTitle>
          <CardSubtitle>
            <small className='text-muted'>
              <Badge color='light'>{upperCase(element.type)}</Badge>{' '}
              {has(elements, 'name')
                ? element.name || <em>_identifier</em>
                : null}
              {dependentOn ? ` | depends on ${dependentOn}` : null}
            </small>
          </CardSubtitle>
        </CardHeader>
        <CardBody className={'collapse' + (this.state.isOpen ? ' show' : '')}>
          <ElementEditor
            el={element}
            library={library}
            elements={elements}
            initialModel={element}
            setElement={setElementModel}
            translator={this.props.translator}
          />
        </CardBody>
      </Card>
    )
  }
}

export default EditorCard
