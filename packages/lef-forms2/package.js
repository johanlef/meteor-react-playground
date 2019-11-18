Package.describe({
  name: 'lef:forms2',
  version: '1.2.15',
  summary: 'Easy, configuration based form composition',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.7.0.4')
  api.use(['ecmascript', 'lef:translations'])
  Npm.depends({
    'react-dom': '16.5.1',
    'react-reformed': '2.0.0',
    ajv: '6.5.3'
  })
  api.mainModule('client.js', 'client')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('lef-forms2')
})
