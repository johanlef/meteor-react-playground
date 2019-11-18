const hashScroll = customHash => {
  let hash = customHash
  if (!hash) {
    const hashParts = window.location.hash.split('#')
    if (hashParts.length > 1) {
      hash = hashParts.pop()
    }
  }
  if (hash) {
    const node = document.querySelector(`#${hash}`)
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default hashScroll
