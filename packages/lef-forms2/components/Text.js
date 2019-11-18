import React from 'react'
import { Input } from 'reactstrap'

const TextComponent = props => {
  const { bindInput, element, attributes: propsAttributes } = props
  const { name, type, attributes: elementAttributes } = element
  return (
    <Input
      type={type}
      {...bindInput(name)}
      {...elementAttributes}
      {...propsAttributes}
    />
  )
}

const config = ({ translator, model }) => []

export default TextComponent
// export { config }
