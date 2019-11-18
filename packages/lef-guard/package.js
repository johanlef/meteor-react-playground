Package.describe({
  summary: 'Guard the functions you care about',
  version: '0.1.2',
  name: 'lef:guard'
})

Package.onUse(api => {
  api.use(['ecmascript', 'lef:utils'])
  api.mainModule('client.js', 'client')
  api.mainModule('server.js', 'server')
  api.export('Rules', 'server')
})

Npm.depends({
  react: '16.5.2',
  lodash: '4.17.10',
  'react-router': '4.3.1'
})
