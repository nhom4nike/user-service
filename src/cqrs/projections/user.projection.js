/**
 * @typedef {Object} GetUserQuery
 * @property {string} id user's id
 */

/**
 * @typedef {'get' |
 * 'findByEmail'
 * } CommandNames
 */

/** user's query handler */
class UserProjection {
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
    return this.factory.get(query.id)
  }

  async _findByEmail(query) {
    return this.factory.findByEmail(query)
  }

  /**
   * @param {CommandNames} name the name of query command
   * @param {Object} query additional conditions for the query
   */
  async query(name, query) {
    switch (name) {
      case 'get':
        return this._get(query)
      case 'findByEmail':
        return this._findByEmail(query)
      default:
        throw new Error('unknown command: ' + name)
    }
  }
}

module.exports = UserProjection
