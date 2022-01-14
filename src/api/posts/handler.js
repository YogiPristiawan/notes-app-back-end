const ClientError = require('../../exceptions/ClientError')

class PostsImageHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postPostImageHandler = this.postPostImageHandler.bind(this)
  }

  async postPostImageHandler(request, h) {
    try {
      const { image } = request.payload
      this._validator.validateImageHeaders(image.hapi.headers)

      const filename = await this._service.writeFile(image, image.hapi)

      const response = h.response({
        status: 'success',
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
        },
      })
      response.code(201)
      return response
    } catch (err) {
      if (err instanceof ClientError) {
        return h.response({
          status: 'fail',
          messge: err.message,
        }).code(err.statusCode)
      }

      console.error(err)

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami',
      }).code(500)
    }
  }
}

module.exports = PostsImageHandler
