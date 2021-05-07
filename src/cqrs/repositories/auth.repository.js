const crypto = require('crypto')
const jwt = require('jsonwebtoken')

/** buiness logic for write operations */
class AuthRepository {
  /**
   * @param {import('mongoose').Model} model mongoose auth model
   */
  constructor(model) {
    this.model = model
  }

  /** create a jwt for single use, ie. email verification */
  async sign(id) {
    const secret = crypto.randomBytes(64).toString()
    const token = jwt.sign({ iss: id }, secret)
    const document = await this.auths.create({ token, secret })
    return document
  }
}

module.exports = AuthRepository
