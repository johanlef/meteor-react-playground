import React, { useState, useEffect } from 'react'

import './canvas.scss'
import Canvas from './Canvas'
import sources from './sources'

const drawSelection = async (canvas, selection) => {
  if (!canvas) return false
  canvas.clear()
  const paths = sources
    .map(({ key, path }) => (selection.includes(key) ? path : false))
    .filter(v => !!v)
  for (let index = 0; index < paths.length; index++) {
    await canvas.addImage(paths[index])
  }
  return canvas.saveImage()
}

const JEFCanvas = ({ selection, finished }) => {
  const canvasProps = { width: 640, height: 640, id: 'jef-canvas' }
  const [canvas, setCanvas] = useState()
  const [url, setUrl] = useState()
  useEffect(() => {
    if (!canvas) setCanvas(new Canvas(canvasProps))
  })
  canvas
    ? drawSelection(canvas, selection).then(newurl => setUrl(newurl))
    : null
  const name = selection.join('')
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
