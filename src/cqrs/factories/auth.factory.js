const jwt = require('jsonwebtoken')

/** business logic for read operations */
class AuthFactory {
  /**
   * @typedef {import('mongoose').Model} Model
   * @param {Object} models mongoose's models
   * @param {Model} models.users
   * @param {Model} models.auths
   */
  constructor({ users, auths }) {
    this.users = users
    this.auths = auths
  }

  /** verify given jwt, this token will be delete if exists */
  async verify(value) {
    const document = await this.users.findOneAndDelete({
      token: value
    })
    if (!document) return false

    // verify if token has been expired
    const { token, secret } = document
    try {
      return jwt.verify(token, secret) && true
    } catch (error) {
      if (error.name === 'TokenExpiredError') return false
      throw error
    }
  }
}

module.exports = AuthFactory
