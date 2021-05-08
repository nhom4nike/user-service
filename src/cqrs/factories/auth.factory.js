const jwt = require('jsonwebtoken')
const errors = require('../../utils/errors')

/** business logic for read operations */
class AuthFactory {
  /**
   * @typedef {import('mongoose').Model} Model
   * @param {Object} models mongoose's models
   * @param {Model} models.auth
   */
  constructor(auth) {
    this.auth = auth
  }

  async verify(token, secret) {
    try {
      return jwt.verify(token, secret)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw errors.create(errors.codes.auth.token_expired, token)
      }
      if (error.name === 'JsonWebTokenError') {
        throw errors.create(errors.codes.auth.token_invalid, token)
      }
      throw error
    }
  }

  async get(token) {
    return this.auth.findOne({ token })
  }
}

module.exports = AuthFactory
