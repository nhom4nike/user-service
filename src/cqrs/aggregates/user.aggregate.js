/**
 * @typedef {Object} RegistrationPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {'create'} CommandNames
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
   * @param {CommandNames} name the name of command
   * @param {Object} payload command's one or more arguments
   */
  async command(name, payload) {
    if (name === 'create') return this._create(payload)
    throw new Error('unknown command: ' + name)
  }
}

module.exports = UserAggregate
