class NotesHandler {
  constructor(service) {
    this._service = service
    this.postNoteHandler = this.postNoteHandler.bind(this)
    this.getNotesHandler = this.getNotesHandler.bind(this)
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this)
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this)
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this)
  }

  postNoteHandler(request, h) {
    const { title = 'untitled', tags, body } = request.payload
    try {
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
      return h.response({
        status: 'fail',
        message: err.message,
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
    const { id } = request.params
    try {
      const note = this._service.getNoteById(id)
      return h.response({
        status: 'success',
        data: {
          note,
        },
      })
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message,
      }).code(404)
    }
  }

  putNoteByIdHandler(request, h) {
    const { id } = request.params
    try {
      this._service.editNoteById({ id, payload: request.payload })

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      })
      response.code(200)
      return response
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message,
      }).code(404)
    }
  }

  deleteNoteByIdHandler(request, h) {
    const { id } = request.params
    try {
      const result = this._service.deleteNoteById(id)

      return h.response({
        status: 'success',
        message: result,
      })
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message,
      }).code(404)
    }
  }
}

module.exports = NotesHandler
