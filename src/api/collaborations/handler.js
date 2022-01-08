const ClientError = require('../../exceptions/ClientError')

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService
    this._notesService = notesService
    this._validator = validator

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.paylaod)

      const { noteId, userId } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId)

      return h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
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
        status: 'error',
        message: 'Maaf, terjadi kegagalan di server kami',
      }).code(500)
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)

      const { noteId, userId } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      await this._collaborationsService.deleteCollaboration(noteId, userId)

      return h.response({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      }).code(200)
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
}

module.exports = CollaborationsHandler
