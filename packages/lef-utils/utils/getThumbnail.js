const getThumbnail = (image, size) => {
  if (!image) return false
  const sizes = image.thumbnails
    ? Object.keys(image.thumbnails).sort((a, b) => Number(a) - Number(b))
    : []
  return (
    sizes.reduce((a, s, i) => {
      const ss = `${s}`
      if (!a && image.thumbnails && image.thumbnails[ss] && s >= size) {
        a = image.thumbnails[ss]
      }
      return a
    }, false) ||
    image.url ||
    false
  )
}

export default getThumbnail
