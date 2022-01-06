const AuthenticationError = require('../../exceptions/AuthenticationError')
const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema')

const AuthenticationsValidator = {
  validatePostAuthenticationPayloadSchema: (payload) => {
    const { error } = PostAuthenticationPayloadSchema.validate(payload)

    if (error) {
      throw new AuthenticationError(error.message)
    }
  },

  validatePutAuthenticationPayloadSchema: (payload) => {
    const { error } = PutAuthenticationPayloadSchema.validate(payload)

    if (error) {
      throw new AuthenticationError(error.message)
    }
  },

  validateDeleteAuthenticationPayloadSchema: (payload) => {
    const { error } = DeleteAuthenticationPayloadSchema.validate(payload)

    if (error) {
      throw new AuthenticationError(error.message)
    }
  },
}

module.exports = AuthenticationsValidator
