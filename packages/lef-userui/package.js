Package.describe({
  summary: 'Simple UI elements for user login/logout',
  version: '1.1.0',
  name: 'lef:userui',
  git: 'https://github.com/LEFapps/lef-userui'
})

Package.onUse(api => {
  api.use([
    'ecmascript',
    'lef:translations',
    'lef:alerts',
    'lef:systemmailing',
    'react-meteor-data'
  ])
  api.addFiles('server.js', 'server')
  api.addFiles('userui.css', 'client')
  api.mainModule('client.js', 'client')
})
