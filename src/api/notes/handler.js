const ClientError = require('../../exceptions/ClientError')

class NotesHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
    this.postNoteHandler = this.postNoteHandler.bind(this)
    this.getNotesHandler = this.getNotesHandler.bind(this)
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this)
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this)
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this)
  }

  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload)

      const { title = 'untitled', tags, body } = request.payload
      const { id: credentialId } = request.auth.credentials

      const id = await this._service.addNote({
        title,
        tags,
        body,
        owner: credentialId,
      })

      return h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId: id,
        },
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
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500)
    }
  }

  async getNotesHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const notes = await this._service.getNotes(credentialId)

      return h.response({
        status: 'success',
        data: {
          notes,
        },
      })
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

  async getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyNoteOwner(id, credentialId)
      const note = await this._service.getNoteById(id)

      return h.response({
        status: 'success',
        data: {
          note,
        },
      })
    } catch (err) {
      if (err instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: err.message,
        }).code(err.statusCode)
      }

      console.error(err)

      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500)
    }
  }

  async putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload)

      const { id } = request.params
      const { title, body, tags } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyNoteOwner(id, credentialId)
      await this._service.editNoteById(id, { title, body, tags })

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      })
      response.code(200)
      return response
    } catch (err) {
      if (err instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: err.message,
        }).code(err.statusCode)
      }

      console.error(err)

      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500)
    }
  }

  async deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyNoteOwner(id, credentialId)
      await this._service.deleteNoteById(id)

      return h.response({
        status: 'success',
        message: 'Catatan berhasil dihapus',
      })
    } catch (err) {
      console.log(err)
      if (err instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: err.message,
        }).code(err.statusCode)
      }

      console.error(err)

      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      }).code(500)
    }
  }
}

module.exports = NotesHandler
