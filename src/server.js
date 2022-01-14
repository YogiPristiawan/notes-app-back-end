require('dotenv').config()
const Hapi = require('@hapi/hapi')

/**
 * notes
 */
const Jwt = require('@hapi/jwt')
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

/**
 * collaborations
 */
const collaborationsPlugin = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

/**
 * exports
 */
const exportsPlugin = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportNotesValidator = require('./validator/exports')

/**
 * posts image
 */
const postsImagePlugin = require('./api/posts')

const init = async () => {
  const collaborationsService = new CollaborationsService()
  const notesService = new NotesService(collaborationsService)
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
      plugin: Jwt,
    },
  ])

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        service: ProducerService,
        validator: ExportNotesValidator,
      },
    },
    {
      plugin: postsImagePlugin,
    },
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
