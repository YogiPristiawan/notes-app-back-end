const Joi = require('joi')

const PostAuthenticationPayloadSchema = Joi.Object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

const PutAuthenticationPayloadSchema = Joi.Object({
  refreshToken: Joi.string().required(),
})

const DeleteAuthenticationPayloadSchema = Joi.Object({
  refreshToken: Joi.string().required(),
})

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
}
