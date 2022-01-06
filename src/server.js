require('dotenv').config()
const Hapi = require('@hapi/hapi')

/**
 * notes
 */
const notesPlugin = require('./api/notes')
const NotesService = require('./services/postgres/NotesService')
const NotesValidator = require('./validator/notes')

/**
 * users
 */
const usersPlugin = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

/**
 * authentications
 */
const authenticationsPlugin = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const AuthenticationsValidator = require('./validator/authentications')
const TokenManager = require('./tokenize/TokenManager')

const init = async () => {
  const notesService = new NotesService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()

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

  await server.register([
    {
      plugin: notesPlugin,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        authenticationsService,
        usersService,
        validator: AuthenticationsValidator,
        tokenManager: TokenManager,
      },
    },
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
