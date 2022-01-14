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
]

module.exports = routes
