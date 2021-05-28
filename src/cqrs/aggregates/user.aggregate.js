/**
 * @typedef {Object} RegistrationPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {'create' |
 * 'updateRefreshToken' |
 * 'update'
 * } CommandNames
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

  async _updateRefreshToken(payload) {
    return this.repository.update(payload.id, {
      refreshToken: payload.refreshToken
    })
  }

  async _update(payload) {
    return this.repository.update(payload.id, payload)
  }

  /**
   * @param {CommandNames} name the name of command
   * @param {Object} payload command's one or more arguments
   */
  async command(name, payload) {
    switch (name) {
      case 'create':
        return this._create(payload)
      case 'updateRefreshToken':
        return this._updateRefreshToken(payload)
      case 'update':
        return this._update(payload)
      default:
        throw new Error('unknown command: ' + name)
    }
  }
}

module.exports = UserAggregate
