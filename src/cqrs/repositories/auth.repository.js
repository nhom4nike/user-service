const crypto = require('crypto')
const jwt = require('jsonwebtoken')

/** business logic for write operations */
class AuthRepository {
  /**
   * @param {import('mongoose').Model} model mongoose auth model
   */
  constructor(model) {
    this.model = model
  }

  async generateToken(payload, secret, options) {
    return jwt.sign({ payload }, secret, options)
  }

  async saveToken(token) {
    return await this.model.create({ token })
  }

  async deleteToken(token) {
    return await this.model.findOneAndDelete({ token: token })
  }
}

module.exports = AuthRepository
