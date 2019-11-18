import React, { Component } from 'react'
import { Random } from 'meteor/random'
import { FormComposer } from './FormComposer'
import reformed from './reformed'
import EditorCard from './editor/EditorCard'
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  CardHeader,
  UncontrolledCollapse,
  UncontrolledButtonDropdown,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { get, capitalize, cloneDeep } from 'lodash'

const transformElements = (elements, library, saving = true) =>
  elements.map(element => {
    const el = cloneDeep(element)
    const { type } = el
    if (library.has(type)) {
      const { transformer } = library.get(type)
      return transformer ? transformer(el, saving) : el
    } else return el
  })

class FormEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPreview: true,
      elements: this.props.initialModel
        ? transformElements(this.props.initialModel, props.library, false)
        : []
    }
    this.setElement = this.setElement.bind(this)
    this.save = this.save.bind(this)
    this.addElement = this.addElement.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.moveElement = this.moveElement.bind(this)
    this.duplicateElement = this.duplicateElement.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.showPreview = this.showPreview.bind(this)
  }
  setElement (index, element) {
    this.setState(prevstate => {
      prevstate.elements[index] = transformElements(
        [element],
        this.props.library,
        false
      )[0]
      return { elements: prevstate.elements }
    })
    this.showPreview(false)
    return element
  }
  save () {
    const { library } = this.props
    const { elements } = this.state
    this.props.onSubmit(transformElements(elements, library))
  }
  addElement (type) {
    this.setState(prevstate => {
      prevstate.elements.push({ type, key: Random.id() })
      return {
        elements: prevstate.elements
      }
    })
    this.showPreview(false)
  }
  duplicateElement (element) {
    this.setState(prevstate => {
      const index = prevstate.elements.indexOf(element)
      const duplicate = cloneDeep(prevstate.elements[index])
      if (duplicate) {
        if (duplicate.name) duplicate.name += '_copy'
        if (duplicate.label) duplicate.label += ' (copy)'
        if (duplicate.key) duplicate.key = Random.id()
        prevstate.elements.splice(index + 1, 0, duplicate)
        return { elements: prevstate.elements }
      } else {
        return { elements: prevstate.elements }
        console.error(`Element not found (${element.name}, ${index}).`)
      }
    })
    this.showPreview(false)
  }
  moveElement (element, direction) {
    this.setState(prevstate => {
      const index = prevstate.elements.indexOf(element)
      prevstate.elements.splice(index, 1)
      prevstate.elements.splice(index + direction, 0, element)
      return { elements: prevstate.elements }
    })
    this.showPreview(false)
  }
  moveElementUp (element) {
    this.moveElement(element, -1)
  }
  moveElementDown (element) {
    this.moveElement(element, 1)
  }
  removeElement (element) {
    if (
      confirm(
        `Are you sure you want to remove the element "${element.name ||
          'empty ' + element.type}"`
      )
    ) {
      this.setState(prevstate => {
        const index = this.state.elements.indexOf(element)
        if (index >= 0) {
          prevstate.elements.splice(index, 1)
          return {
            elements: prevstate.elements
          }
        } else console.error(`Element not found (${element.name}, ${index}).`)
      })
      this.showPreview(false)
    }
  }
  showPreview (show = true) {
    this.setState({ showPreview: show })
  }
  render () {
    const { library } = this.props
    const { previewLibrary = library } = this.props
    const ReformedFormComposer = reformed()(FormComposer)
    const totalElements = this.state.elements.length
    const canMove = (index, dir) =>
      dir < 0 ? index > 0 : index < totalElements - 1
    return (
      <Container>
        <ButtonMenu library={library} addElement={this.addElement} />
        {this.state.elements.map((element, index) => {
          if (library.has(element.type)) {
            const elements = library.get(element.type).config()
            const setElementModel = el => {
              this.setElement(index, el)
              return el
            }
            return (
              <EditorCard
                library={library}
                index={index}
                canMove={canMove}
                element={element}
                elements={elements}
                setElementModel={setElementModel}
                onRemove={this.removeElement}
                onDuplicate={this.duplicateElement}
                onMoveElement={this.moveElement}
                key={`element-${element.key || index}`}
                translator={this.props.translator}
              />
            )
          } else return null
        })}
        <Row>
          <Col md={12}>
            <Button onClick={this.save}>Save</Button>
          </Col>
        </Row>
        <hr />
        {this.state.showPreview ? (
          <Row>
            <Col xs={12}>
              <h3>Preview</h3>
              <ReformedFormComposer
                library={previewLibrary}
                elements={transformElements(
                  this.state.elements,
                  this.props.library
                )}
                translator={this.props.translator}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={12}>
              <p>
                The form has changed. Click the button below to load preview
                again.
              </p>
            </Col>
            <Col>
              <Button onClick={this.showPreview}>Load preview</Button>
            </Col>
          </Row>
        )}
      </Container>
    )
  }
}

class ButtonMenu extends Component {
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
  render () {
    const { library, addElement } = this.props
    return (
      <ButtonDropdown
        isOpen={this.state.isOpen}
        toggle={this.toggle}
        direction='right'
      >
        <DropdownToggle caret>Add an Element&nbsp;</DropdownToggle>
        <DropdownMenu>
          <ButtonGroup vertical>
            {Array.from(library.keys()).map(type => {
              return (
                <DropdownItem
                  key={`add-${type}`}
                  onClick={() => {
                    this.toggle(), addElement(type)
                  }}
                >
                  {capitalize(type)}
                </DropdownItem>
              )
            })}
          </ButtonGroup>
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}

// const configuration
//

export { ElementEditor, FormEditor }
