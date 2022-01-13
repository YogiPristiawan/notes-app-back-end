const ExportsHandler = require('./handler')
const routes = require('./routes')

const exportsPlugin = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportsHandler(service, validator)

    server.route(routes(exportsHandler))
  },
}

module.exports = exportsPlugin
