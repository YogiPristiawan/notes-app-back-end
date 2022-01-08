const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class CollaborationsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
    })
  }

  async addCollaboration(noteId, userId) {
    const id = `collab-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO collaborations (id, note_id, user_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async deleteCollaboration(noteId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus')
    }

    return result.rows[0].id
  }

  async verifyCollaboration(noteId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Kolaborasi gagal diverifikasi')
    }
  }
}

module.exports = CollaborationsService
