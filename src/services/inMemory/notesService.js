const { nanoid } = require('nanoid')

class NotesService {
  constructor() {
    this._notes = []
  }

  addNote({ title, tags, body }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
      title, tags, body, id, createdAt, updatedAt,
    }

    this._notes.push(newNote)

    const isSuccess = this._notes.filter((note) => note.id === id).length > 0

    if (isSuccess) {
      return id
    }

    throw new Error('Data gagal ditambahkan')
  }

  getAllNote() {
    return this._notes
  }

  getNoteById(id) {
    const note = this._notes.filter((n) => n.id === id)[0]

    if (note !== undefined) {
      return note
    }

    throw new Error('Catatan tidak ditemukan')
  }

  editNoteById({ id, payload }) {
    const { title, tags, body } = payload
    const updatedAt = new Date().toISOString()

    const index = this._notes.findIndex((note) => note.id === id)

    if (index !== -1) {
      this._notes[index] = {
        ...this._notes[index],
        title,
        tags,
        body,
        updatedAt,
      }

      return 'Catatan berhasil diperbarui'
    }

    throw new Error('Gagal memeperbarui catatan. Id tidak ditemukan')
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id)

    if (index !== 1) {
      this._notes.splice(index, 1)
      return 'Catatan berhasil dihapus'
    }

    throw new Error('Catatan gagal dihapus. Id tidak ditemukan')
  }
}

module.exports = NotesService
