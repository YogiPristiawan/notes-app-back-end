const path = require('path')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/posts',
    handler: handler.postPostImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  }
]

module.exports = routes
