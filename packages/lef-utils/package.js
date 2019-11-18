Package.describe({
  summary: 'Tiny LEF utilities',
  version: '1.7.2',
  name: 'lef:utils'
})

Package.onUse(api => {
  api.use(['ecmascript'])
  api.mainModule('client.js', 'client')
  api.mainModule('server.js', 'server')
})
