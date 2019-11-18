import { hasToBlobSupport, promiseBlobFromCanvas, toBlob } from './blob'

class Canvas {
  constructor ({ id, ...config }) {
    const canvas = document.getElementById(id)
    if (!canvas) throw new Error(`Canvas ${id} not found`)
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.config = config
    this._setDefaults()
    this.clear()
    return this
  }
  _setDefaults () {
    this.context
    this.context.imageSmoothingEnabled = true
    this.context.imageSmoothingQuality = 'high'
    return this.context
  }
  clear () {
    const { width, height } = this.canvas
    this.context.clearRect(0, 0, width, height)
  }
  async addImage (image) {
    const img = document.createElement('img')
    const imgLoader = new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = image
    })
    return await imgLoader
      .then(() => this.context.drawImage(img, 0, 0, img.width, img.height))
      .catch(error => console.error(error))
  }
  saveImage (filename) {
    this.context.save()
    return this.canvas.toDataURL()

    /* return hasToBlobSupport
      ? promiseBlobFromCanvas(this.canvas, 'image/png').then(blob => {
        blob.name = filename
        return blob
      })
      : toBlob(canvas, 'image/png', filename) */
  }
}

export default Canvas
