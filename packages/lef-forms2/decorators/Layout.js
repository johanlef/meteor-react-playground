import React from 'react'
import { Col } from 'reactstrap'
import { includes } from 'lodash'

const LayoutDecorator = WrappedComponent => props => {
  if (props.element.layout) {
    return (
      <Col {...props.element.layout.col}>
        <WrappedComponent {...props} />
      </Col>
    )
  } else {
    return (
      <Col>
        <WrappedComponent {...props} />
      </Col>
    )
  }
}

const layout = { col: { md: '3', sm: '6', xs: '12' } }
const options = [
  { _id: '', default: 'Auto' },
  { _id: 12, default: '12 / 12 (full width)' },
  { _id: 11, default: '11 / 12' },
  { _id: 10, default: '10 / 12' },
  { _id: 9, default: '9 / 12 (three quarters)' },
  { _id: 8, default: '8 / 12 (two thirds)' },
  { _id: 7, default: '7 / 12' },
  { _id: 6, default: '6 / 12 (half)' },
  { _id: 5, default: '5 / 12' },
  { _id: 4, default: '4 / 12 (third)' },
  { _id: 3, default: '3 / 12 (quarter)' },
  { _id: 2, default: '2 / 12' },
  { _id: 1, default: '1 / 12' }
]

const config = ({ translator, model }) => [
  {
    key: 'layout.divider',
    type: 'divider',
    layout: { col: { xs: 12 } }
  },
  {
    key: 'layout.infobox',
    type: 'infobox',
    label: '**Column Width**',
    layout: { col: { xs: 12 } }
  },
  {
    key: 'layout.xs',
    name: 'layout.col.xs',
    type: 'select',
    label: 'Phone',
    options,
    layout
  },
  {
    key: 'layout.sm',
    name: 'layout.col.sm',
    type: 'select',
    label: 'Tablet',
    options,
    layout
  },
  {
    key: 'layout.md',
    name: 'layout.col.md',
    type: 'select',
    label: 'Laptop',
    options,
    layout
  },
  {
    key: 'layout.lg',
    name: 'layout.col.lg',
    type: 'select',
    label: 'Desktop',
    options,
    layout
  }
]

const filter = key =>
  !includes(
    [
      /* 'divider' */
    ],
    key
  )

export default LayoutDecorator
export { config, filter }
