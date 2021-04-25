const sha512 = require('crypto-js/hmac-sha512')
const base64 = require('crypto-js/enc-base64')
const random = require('crypto-random-string')

/**
 * @typedef {Object} RegistrationPayload
 * @property {string} email
 * @property {string} password sha512-hash password
 * @property {boolean} verfied whether this user's email has been verified
 */

/** user's commands handler */
class UserAggregate {
  /**
   * @param {import('../repositories/user.repository')} repository
   */
  constructor(repository) {
    this.repository = repository
  }

  /**
   * @param {RegistrationPayload} payload
   */
  async _create(payload) {
    const secret = random(128)
    const password = base64.stringify(sha512(payload.password, secret))
    return this.repository.create({
      email: payload.email,
      secret,
      password,
      verfied: payload.verfied
    })
  }

  /**
   * @param {Object} command
   * @param {'create'} command.name the name of command
   * @param {Object} command.payload additional conditions for the query
   */
  async handle({ name, payload }) {
    if (name === 'create') return this._create(payload)
    throw new Error('unknown command: ' + name)
  }
}

module.exports = UserAggregate
