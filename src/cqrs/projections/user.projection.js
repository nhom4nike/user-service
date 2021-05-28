/**
 * @typedef {Object} GetUserQuery
 * @property {string} id user's id
 */

/**
 * @typedef {'get' |
 * 'findByEmail' |
 * 'getInfo'
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

  async _getInfo(user) {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      telephone: user.telephone,
      position: user.position,
      status: user.status,
      username: user.username,
      email: user.email,
      password: user.password,
      publicKey: user.publicKey,
      crypt: user.crypt
    }
  }

  /**
   * @param {CommandNames} name the name of query command
   * @param {Object} query additional conditions for the query
   */
  async query(name, query) {
    switch (name) {
      case 'get':
        return this._get(query)
      case 'getInfo':
        return this._getInfo(query)
      case 'findByEmail':
        return this._findByEmail(query)
      default:
        throw new Error('unknown command: ' + name)
    }
  }
}

module.exports = UserProjection
