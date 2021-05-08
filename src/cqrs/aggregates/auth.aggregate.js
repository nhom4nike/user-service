/**
 * @typedef {Object} RegistrationPayload
 * @property {string} email
 * @property {string} password sha512-hash password
 * @property {boolean} verified whether this user's email has been verified
 */

/** user's commands handler */
class AuthAggregate {
  /**
   * @param {import('../repositories/auth.repository')} repository
   */
  constructor(repository) {
    this.repository = repository
  }

  /**
   * @param {RegistrationPayload} payload
   */
  async _sign(payload) {
    return this.repository.sign(payload)
  }

  /**
   * @param {'create'}name the name of command
   * @param {Object}payload additional conditions for the query
   */
  async command(name, payload) {
    if (name === 'sign') return this._sign(payload)
    throw new Error('unknown command: ' + name)
  }
}

module.exports = AuthAggregate
