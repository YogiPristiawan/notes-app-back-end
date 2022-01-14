const PostsImageHandler = require('./handler')
const routes = require('./routes')

const postsImagePlugin = {
  name: 'posts',
  version: '1.0.0',
  register: async (server) => {
    const postsImageHandler = new PostsImageHandler()

    server.route(routes(postsImageHandler))
  },
}

module.exports = postsImagePlugin
