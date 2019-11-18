import { DecoratorLibrary } from './Library'
import {
  union,
  stubTrue,
  stubArray,
  identity,
  isFunction,
  isArray
} from 'lodash'

/* Note: the sequence here determines the sequence
 * in which they are applied in EasyForm!
 */

const library = new DecoratorLibrary([
  ['attributes', './decorators/Attributes'],
  ['validate', './decorators/Validate'],
  ['placeholder', './decorators/Placeholder'],
  ['formgroup', './decorators/FormGroup'],
  ['name', './decorators/Name'],
  ['layout', './decorators/Layout'],
  ['dependent', './decorators/Dependent']
])

library.forEach((path, name) => {
  const decorator = require(path)
  library.set(name, {
    decorator: decorator.default,
    config: isFunction(decorator.config) ? decorator.config : stubArray,
    combine: isFunction(decorator.combine) ? decorator.combine : union,
    filter: isFunction(decorator.filter) ? decorator.filter : stubTrue,
    transform: isFunction(decorator.transform) ? decorator.transform : identity
  })
})

export default library
