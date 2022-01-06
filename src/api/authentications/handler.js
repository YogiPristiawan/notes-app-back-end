const ClientError = require('../../exceptions/ClientError')

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService
    this._usersService = usersService
    this._tokenManager = tokenManager
    this._validator = validator

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayloadSchema(request.payload)

      const { username, password } = request.payload

      const id = await this._usersService.verifyUserCredentials(username, password)

      const accessToken = this._tokenManager.generateAccessToken({ id })
      const refreshToken = this._tokenManager.generateRefreshToken({ id })

      await this._authenticationsService.addRefreshToken(refreshToken)

      return h.resposne({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        accessToken,
        refreshToken,
      }).code(201)
    } catch (err) {
      if (err instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: err.message,
        }).code(err.statusCode)
      }

      console.error(err)

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan di server kami',
      }).code(500)
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayloadSchema(request.payload)

      const { refreshToken } = request.payload
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

      await this._authenticationsService.verifyRefreshToken(refreshToken)

      const accessToken = this._tokenManager.generateAccessToken({ id })

      return h.response({
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      }).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: err.message,
        }).code(err.statusCode)
      }

      console.error(err)

      return h.respnse({
        status: 'error',
        message: 'Maaf, terjadi kegagalan di server kami.',
      }).code(500)
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayloadSchema(request.payload)

      const { refreshToken } = request.payload

      await this._authenticationsService.verifyRefreshToken(refreshToken)
      await this._authenticationsService.deleteRefreshToken(refreshToken)

      return h.response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      }).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: err.message,
        }).code(err.statusCode)
      }

      console.error(err.message)

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan di server kami',
      }).code(500)
    }
  }
}

module.exports = AuthenticationsHandler
