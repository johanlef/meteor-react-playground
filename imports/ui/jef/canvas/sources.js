/**
 * Your source image MUST come from the same origin, e.g. https://localhost:3000.
 * If this requirement is not met, you won't be able to download the rsulting image
 * from the "tainted" canvas due to 'unsafe' cross-origin sources.
 *
 * In this playground, the images live in the "/public" directory
 * which means they are accessible from the same host.
 */

const host = '/jef-canvas/'

/**
 * Add your layers below:
 * - order is important (first element appears under the next one)
 * - edit key to your liking
 * - complete path is recommended to be relative to the root
 */

export default [
  { key: '10', path: host + '10.png' },
  { key: '11', path: host + '11.png' },
  { key: '00', path: host + '00.png' },
  { key: '21', path: host + '21.png' },
  { key: '20', path: host + '20.png' }
]
