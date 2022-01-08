/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  /**
   * add new dummy user
   */
  pgm.sql("INSERT INTO users (id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')")

  /**
   * update notes
   */
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL")

  /**
   * add constraints
   */
  pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  /**
   * delete constraints
   */
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id')

  /**
   * set notes owner to NULL
   */
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'")

  /**
   * delete new dummy user
   */
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'")
}
