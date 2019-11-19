import React, { useState, useEffect } from 'react'

import './canvas.scss'
import Canvas from './Canvas'
import sources from './sources'

/**
 * Renders each layer in the correct order (see ./sources for more info).
 * After complete render, a dataUrl of the image is returned.
 */

const drawSelection = async (canvas, selection) => {
  // only attempt drawing when a canvas is present
  if (!canvas) return false
  // clear the drawing board because we can't insert layers
  canvas.clear()
  // get paths to selected layers
  const paths = sources
    .map(({ key, path }) => (selection.includes(key) ? path : false))
    .filter(v => !!v)
  // render each layer subsequently
  for (let index = 0; index < paths.length; index++) {
    await canvas.addImage(paths[index])
  }
  // return dataUrl after rendering
  return canvas.saveImage()
}

/**
 * This is the main React component.
 * It accepts two parameters:
 * - bool 'finished' merely limits the visibility of the save button
 * - array 'selection' contains the keys of the sources to be rendered, (order not particularly important)
 *
 * The final layer combination can be downloaded through the 'save' link.
 * Please use your own logic to store the png image appropriately.
 * You can hook into the drawSelection().then() callback (preferably only when finished === true).
 *
 * The selection array in this example is never empty, layer '00' (the naked figurine) is always rendered.
 * Make sure your selection always contains the base layer!
 * ['00'] -> ['00', '11'] -> ['00', '11', '20'] -> …
 */

const JEFCanvas = ({ selection, finished }) => {
  // you can set your own here
  const canvasProps = { width: 640, height: 640, id: 'jef-canvas' }
  // rudimentary filename for current layer combination
  const name = selection.join('')

  // stores canvas instance
  const [canvas, setCanvas] = useState()
  // stores image data Url
  const [url, setUrl] = useState()

  // instantiate the Canvas if not set
  useEffect(() => {
    if (!canvas) setCanvas(new Canvas(canvasProps))
  })

  // render the current selection, set download url when all layers are rendered
  canvas
    ? drawSelection(canvas, selection)
      .then(setUrl)
      .catch(console.error)
    : null

  // render :)
  return (
    <div id={'jef-canvas-container'}>
      <canvas {...canvasProps} />
      {url && finished ? (
        <a href={url} download={name}>
          save
        </a>
      ) : null}
    </div>
  )
}

/**
 * You can probably skip the component below,
 * it only functions as an interface to add certain layers.
 */

const JEFCanvasInterface = () => {
  const [selection, setSelection] = useState(['00'])
  return (
    <div>
      <aside>
        <button
          disabled={selection.length !== 1}
          onClick={() => setSelection(selection.concat(['10']))}
        >
          haar
        </button>{' '}
        <button
          disabled={selection.length !== 1}
          onClick={() => setSelection(selection.concat(['11']))}
        >
          staart
        </button>{' '}
        <button
          disabled={selection.length !== 1}
          onClick={() => setSelection(selection.concat([null]))}
        >
          skip
        </button>
        {' | '}
        <button
          disabled={selection.length !== 2}
          onClick={() => setSelection(selection.concat(['20']))}
        >
          boots
        </button>{' '}
        <button
          disabled={selection.length !== 2}
          onClick={() => setSelection(selection.concat(['21']))}
        >
          overall
        </button>{' '}
        <button
          disabled={selection.length !== 2}
          onClick={() => setSelection(selection.concat([null]))}
        >
          skip
        </button>
        {' | '}
        <button onClick={() => setSelection(['00'])}>reset</button>
        <hr />
      </aside>
      <JEFCanvas selection={selection} finished={selection.length >= 3} />
    </div>
  )
}

export default JEFCanvasInterface
export { JEFCanvas }
