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

  postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload)

      const { title = 'untitled', tags, body } = request.payload

      const id = this._service.addNote({
        title,
        tags,
        body,
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

  getNotesHandler(request, h) {
    const notes = this._service.getAllNote()

    return h.response({
      status: 'success',
      data: {
        notes,
      },
    })
  }

  getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params

      const note = this._service.getNoteById(id)

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

  putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload)

      const { id } = request.params

      this._service.editNoteById({ id, payload: request.payload })

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

  deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params

      const result = this._service.deleteNoteById(id)

      return h.response({
        status: 'success',
        message: result,
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
        message: 'Maaf, terjadi kesalahan pada server kami.',
      }).code(500)
    }
  }
}

module.exports = NotesHandler
