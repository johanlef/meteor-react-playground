import React from 'react'
import {
  get,
  isEmpty,
  isUndefined,
  isArray,
  castArray,
  intersection,
  includes,
  compact,
  map,
  merge
} from 'lodash'

const dependency = ({ on, operator, values }) => model => {
  const value = get(model, on)
  if (isUndefined(operator) && isUndefined(values)) return !isEmpty(value)
  else if (isUndefined(operator)) {
    if (isEmpty(values)) return isEmpty(value)
    else {
      return !isEmpty(
        intersection(
          castArray(value),
          isArray(values)
            ? values
            : includes(values, ',')
              ? values.split(',')
              : castArray(values)
        )
      )
    }
  } else {
    switch (operator) {
      case 'in':
        return !isEmpty(
          intersection(
            castArray(value),
            isArray(values)
              ? values
              : includes(values, ',')
                ? values.split(',')
                : castArray(values)
          )
        )
        break
      case 'gt':
        return values > value
        break
      case 'gte':
        return values >= value
        break
      case 'lt':
        return values < value
        break
      case 'lte':
        return values <= value
        break
      case 'is':
        return values == value
        break
      case 'isnt':
        return values != value
        break
      default:
        return !isEmpty(value)
    }
  }
}

const Dependent = WrappedComponent => props => {
  if (props.element.dependent) {
    if (!dependency(props.element.dependent)(props.model)) {
      return null
    }
  }
  return <WrappedComponent {...props} />
}

const config = ({ translator, model }) => [
  {
    key: 'dependent.divider',
    type: 'divider',
    layout: { col: { xs: 12 } }
  },
  {
    key: 'dependent.infobox',
    type: 'infobox',
    label: '**Field display depends on other field**',
    layout: { col: { xs: 12 } }
  },
  {
    key: 'dependent.on',
    name: 'dependent.on',
    type: model ? 'select' : 'text',
    label: 'Identifier of other field',
    options: model
      ? compact(
          map(
            model,
            element =>
              model.name ? merge({ _id: model.name }, model.label) : false
          )
        )
      : [],
    attributes: {
      placeholder: 'Field identifier'
    },
    layout: { col: { xs: 12, sm: 12, md: 4 } }
  },
  {
    key: 'dependent.operator',
    name: 'dependent.operator',
    type: 'select',
    label: 'Condition',
    layout: { col: { xs: 12, sm: 5, md: 3 } },
    dependent: { on: 'dependent.on' }, // oh yes :)
    options: [
      {
        _id: '',
        default: '… has any value.'
      },
      {
        _id: 'is',
        default: '… is exactly …'
      },
      {
        _id: 'isnt',
        default: '… has any value, except …'
      },
      {
        _id: 'in',
        default: '… contains …'
      },
      {
        _id: 'gt',
        default: '… is greater than …'
      },
      {
        _id: 'gte',
        default: '… is greater or equal to …'
      },
      {
        _id: 'lt',
        default: '… is less than …'
      },
      {
        _id: 'lte',
        default: '… is less or equal to …'
      }
    ]
  },
  {
    key: 'dependent.values',
    name: 'dependent.values',
    type: 'text',
    label: 'Value',
    layout: { col: { xs: 12, sm: 7, md: '5' } },
    dependent: {
      on: 'dependent.operator',
      operator: 'in',
      values: ['in', 'gt', 'gte', 'lt', 'lte', 'is', 'isnt']
    },
    attributes: {
      placeholder: 'Blank unless value matters'
    }
  }
]

const filter = key => !includes([], key)

export default Dependent
export { config }
