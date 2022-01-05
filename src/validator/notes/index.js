const { NotePayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const NotesValidator = {

  validateNotePayload: (payload) => {
    const { error } = NotePayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },
}

module.exports = NotesValidator
