require('dotenv').config()
const Hapi = require('@hapi/hapi')
const notesPlugin = require('./api/notes')
const NotesService = require('./services/inMemory/NotesService')
const NotesValidator = require('./validator/notes')

const init = async () => {
  const notesService = new NotesService()
  const server = Hapi.server({
    port: process.env.PORT || '5000',
    host: process.env.HOST,
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
      validator: NotesValidator,
    },
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
