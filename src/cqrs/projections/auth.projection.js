/**
 * @typedef {Object} GetUserQuery
 * @property {string} id user's id
 */

/** user's query handler */
class AuthProjection {
  /**
   * @param {import('../factories/user.factory')} factory
   */
  constructor(factory) {
    this.factory = factory
  }

  /**
   * @param {GetUserQuery} query
   */
  async _get(query) {
    return this.factory.get(query.token)
  }

  /**
   * @param {Object} command
   * @param {'get'} name the name of query command
   * @param {Object} query additional conditions for the query
   */
  async query(name, query) {
    switch (name) {
      case 'get':
        return this._get(query)
      default:
        throw new Error('unknown command: ' + name)
    }
  }
}

module.exports = AuthProjection
