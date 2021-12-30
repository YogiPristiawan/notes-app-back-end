const Hapi = require('@hapi/hapi')
const notesPlugin = require('./api/notes/index')
const NotesService = require('./services/inMemory/notesService')

const init = async () => {
  const notesService = new NotesService()
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.route({
    method: 'GET',
    path: '/about',
    handler: () => 'About page',
  })

  await server.register({
    plugin: notesPlugin,
    options: {
      service: notesService,
    },
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
