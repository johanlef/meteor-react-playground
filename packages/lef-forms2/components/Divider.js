import React from 'react'

const DividerComponent = props => {
  const { bindInput, element, attributes: propsAttributes } = props
  const { attributes: elementAttributes } = element
  return <hr {...elementAttributes} {...propsAttributes} />
}

const transform = (element, { translator, model }, saving) => {
  if (saving) {
    if (element.layout) {
      element.layout.col = { xs: 12 }
    } else element.layout = { col: { xs: 12 } }
  }
  return element
}

const config = ({ translator, model }) => [
  {
    key: 'divider',
    name: 'divider',
    type: 'select',
    label: 'Divider type',
    options: ['', 'hr'],
    optionNames: ['-', 'Ruler'],
    layout: { col: { sm: 6 } }
  }
]

export default DividerComponent
// export { transform }
