const { validate: validateEmail } = require('email-validator')
const bcrypt = require('bcrypt')

/**
 * @typedef {Object} UserRegistration
 * @property {string} email
 * @property {string} username
 * @property {string} password 128-character hashed password
 */

/** buiness logic for write operations */
class UserRepository {
  /**
   * @param {import('../../database/user.model')} model a mongoose model
   */
  constructor(model) {
    this.model = model
  }

  /**
   * @param {UserRegistration} user
   * @param {boolean} test turn on test mode,
   * which doesn't perform validation and password hashing,
   * should only be use in testing
   * @returns {Promise<string>} id of new user
   */
  async create({ username, email, password }, test = false) {
    if (!test) {
      // perform validation
      if (!validateEmail(email)) {
        throw new Error('user/invalid-email')
      }
      if (!this.validatePassword(password)) {
        throw new Error('user/weak-password')
      }
    }

    const secret = test ? password : await bcrypt.genSalt(12)
    const hashed = test ? password : await bcrypt.hash(password, secret)
    const document = await this.model.create({
      username: username?.trim(),
      email: email?.trim(),
      secret,
      password: hashed
    })
    return document.id
  }

  /**
   * @note password must be 8 character-length, must contain at least 1 lowercase character,
   * 1 uppercase character, 1 digit, 1 special character in !@#$%^&*()\-__+.
   * @example ^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$?}{%^&*()\-_+.[\]]){1,}).{8,}$
   */
  validatePassword(password = '') {
    const regex = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$?}{%^&*()\-_+.[\]]){1,}).{8,}$/g
    return password.match(regex)
  }
}

module.exports = UserRepository
