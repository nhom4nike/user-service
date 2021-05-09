require('dotenv').config()

/**
 * @typedef {Object} GetTokenQuery
 * @property {string} token token
 */

/**
 * @typedef {'get' |
 * 'verifyAccessToken' |
 * 'verifyRefreshToken'
 * } QueryNames
 */

/** user's query handler */
class AuthProjection {
  /**
   * @param {import('../factories/auth.factory')} factory
   */
  constructor(factory) {
    this.factory = factory
  }

  /**
   * @param {GetTokenQuery} query
   */
  async _get(query) {
    return this.factory.get(query.token)
  }

  /**
   * @param {string} query
   */
  async _verifyAccessToken(query) {
    return this.factory.verify(query, process.env.ACCESS_TOKEN_SECRET)
  }

  async _verifyRefreshToken(query) {
    return this.factory.verify(query, process.env.REFRESH_TOKEN_SECRET)
  }

  /**
   * @param {QueryNames} name the name of query command
   * @param {Object} query additional conditions for the query
   */
  async query(name, query) {
    switch (name) {
      case 'get':
        return this._get(query)
      case 'verifyAccessToken':
        return this._verifyAccessToken(query)
      case 'verifyRefreshToken':
        return this._verifyRefreshToken(query)
      default:
        throw new Error('unknown command: ' + name)
    }
  }
}

module.exports = AuthProjection
