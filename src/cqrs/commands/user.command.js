const { v4: uuid } = require('uuid')

class RegisterCommand {
  /**
   * @param {import('../models/user.write').UserRegistration} payload user's info ready for registration
   */
  constructor(payload) {
    this.uuid = uuid()
    this.payload = payload
  }
}

module.exports = {
  RegisterCommand
}
