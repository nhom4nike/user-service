const sha512 = require('crypto-js/hmac-sha512')
const base64 = require('crypto-js/enc-base64')
const random = require('crypto-random-string')
const { UserAggregate } = require('../aggregate/user.aggregate')

/**
 * @classdesc buiness logic for user's commands
 */
module.exports = class UserRepository {
  /**
   * @param {import('../../database/user.model')} model a mongoose model
   */
  constructor(model) {
    this.model = model
    model.aggregate()
  }

  /**
   * @param {import('../commands/user.command').RegisterCommand} command
   */
  async create(command) {
    const { email, verified, password } = command.payload
    const secret = random(128)
    const hash = base64.stringify(sha512(password, secret))
    const user = new UserAggregate().create({
      email,
      verified,
      secret,
      hash
    })
    return this.model.create(user)
  }
}
