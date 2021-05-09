const jwt = require('jsonwebtoken')

/** business logic for read operations */
class AuthFactory {
  /**
   * @typedef {import('mongoose').Model} Model
   * @param {Model} auth
   */
  constructor(auth) {
    this.auth = auth
  }

  async verify(token, secret) {
    return jwt.verify(token, secret)
  }

  async get(token) {
    return this.auth.findOne({ token })
  }
}

module.exports = AuthFactory
