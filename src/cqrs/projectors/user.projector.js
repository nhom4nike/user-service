/**
 * user's query handler
 */
class UserProjection {
  /**
   * @param {import('../factories/user.factory')} repository
   */
  constructor(repository) {
    this.repository = repository
  }

  async getAll() {
    return this.repository.getAll()
  }

  /**
   * @param {Object} command
   * @param {'get-all'|'get'} command.name the name of query command
   * @param {Object} command.payload additional conditions for the query
   */
  async handle({ name, payload }) {
    if (name === 'get-all') return this.getAll()
    throw new Error('unknown command: ' + name)
  }
}

module.exports = UserProjection
