import { Library } from './Library'
import { isArray, isFunction, stubArray, identity } from 'lodash'

// cannot be used by require() since it's not imported anywhere else
import GenericInputNoChildren from './components/GenericInputNoChildren'

const library = new Library([
  ['divider', './components/Divider'],
  ['infobox', './components/InfoBox'],
  ['number', './components/GenericInputNoChildren'],
  ['text', './components/Text'],
  ['textarea', './components/Textarea'],
  ['radio', './components/Radio'],
  ['checkbox', './components/Checkbox'],
  ['checkbox-mc', './components/CheckboxMC'],
  ['checkbox-mc-collection', './components/CheckboxMcCollection'],
  ['select', './components/Select'],
  ['select-collection', './components/SelectCollection'],
  ['phone', './components/GenericInputNoChildren'],
  ['email', './components/GenericInputNoChildren'],
  ['password', './components/GenericInputNoChildren'],
  ['url', './components/GenericInputNoChildren'],
  ['upload', './components/Upload'],
  ['datetime-local', './components/GenericInputNoChildren']
])

// replace the paths with components and their config

library.forEach((path, name) => {
  const component = require(path)
  library.set(name, {
    component: component.default,
    config: isFunction(component.config) ? component.config : stubArray,
    transform: isFunction(component.transform) ? component.transform : identity
  })
})

export default library
