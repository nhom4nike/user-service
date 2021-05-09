require('dotenv').config()
/**
 * @typedef {Object} AuthToken
 * @property {string} token
 */

/**
 * @typedef {'generateAccessToken'|
 * 'generateRefreshToken'|
 * 'saveToken'|
 * 'deleteToken'
 * } CommandNames
 */

/** auth's commands handler */
class AuthAggregate {
  /**
   * @param {import('../repositories/auth.repository')} repository
   */
  constructor(repository) {
    this.repository = repository
  }

  /**
   * @param {AuthToken} payload
   */
  async _generateAccessToken(payload) {
    return this.repository.generateToken(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
  }

  /**
   * @param {AuthToken} payload
   */
  async _generateRefreshToken(payload) {
    const refreshToken = await this.repository.generateToken(
      payload,
      process.env.REFRESH_TOKEN_SECRET
    )
    this._saveToken(refreshToken)
    return refreshToken
  }

  /**
   * @param {AuthToken} payload
   */
  async _saveToken(token) {
    return this.repository.saveToken(token)
  }

  /**
   * @param {AuthToken} payload
   */
  async _deleteToken(token) {
    return this.repository.deleteToken(token)
  }

  /**
   * @param {CommandNames} name the name of command
   * @param {Object} payload command's one or more arguments
   */
  async command(name, payload) {
    switch (name) {
      case 'generateAccessToken':
        return this._generateAccessToken(payload)
      case 'generateRefreshToken':
        return this._generateRefreshToken(payload)
      case 'saveToken':
        return this._saveToken(payload)
      case 'deleteToken':
        return this._deleteToken(payload)
      default:
        throw new Error('unknown command: ' + name)
    }
  }
}

module.exports = AuthAggregate
