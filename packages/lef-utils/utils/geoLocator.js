import { clone } from 'lodash'

const addressObjectToString = ({ street, number, box, zip, city }) =>
  `${street}${
    box ? (number ? ' ' + number + '/' : ' ') + box : number ? ' ' + number : ''
  }, ${zip} ${city}`

const fitBounds = bounds => {
  const result = bounds.map((bound, j) =>
    bound.map((c, i) => {
      let b = clone(c)
      if (i) {
        if (b > 90) b = 90
        else if (b < -90) b = -90
      } else {
        if (b > 180) b = 180
        else if (b < -180) b = -180
      }
      return b
    })
  )
  return result
}

export { addressObjectToString as addressFormat, fitBounds as fixMongoBounds }
