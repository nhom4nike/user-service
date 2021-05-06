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
    return this.repository.create(payload)
    // TODO: send out topic USER_CREATED
  }

  /**
   * @param {'create'}name the name of command
   * @param {Object}payload additional conditions for the query
   */
  async command(name, payload) {
    if (name === 'create') return this._create(payload)
    throw new Error('unknown command: ' + name)
  }
}

module.exports = UserAggregate
