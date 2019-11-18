Package.describe({
  name: 'lef:analytics',
  version: '0.0.0',
  summary: 'Google Analytics Wrapper'
})

Package.onUse(function (api) {
  Npm.depends({
    'react-ga': '2.5.7'
  })
  api.use(['ecmascript'])
  api.mainModule('client.js', 'client')
})
