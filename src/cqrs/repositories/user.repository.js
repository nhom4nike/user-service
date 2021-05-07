const validator = require('validator').default
const errors = require('../../utils/errors')
const bcrypt = require('bcrypt')

/**
 * @typedef {Object} UserRegistration
 * @property {string} email
 * @property {string} username
 * @property {string} password 128-character hashed password
 */

/** business logic for write operations */
class UserRepository {
  /**
   * @param {import('mongoose').Model} model mongoose user model
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
    if (process.env.NODE_ENV !== 'test' && test) {
      console.error(
        'test mode should only be used in test environment, terminate process'
      )
      return process.exit(-1)
    }

    if (!test) {
      // perform validation
      if (!validator.isEmail(email)) {
        throw errors.create('user', 'invalid-email', email)
      }
      if (!validator.isStrongPassword(password)) {
        throw errors.create('user', 'weak-password', password)
      }
    }

    const hashed = test ? password : await bcrypt.hash(password, 12)
    const document = await this.model.create({
      username: username?.trim(),
      email: email?.trim(),
      password: hashed
    })
    return document.id
  }

  async activate(id) {
    return await this.users.findByIdAndUpdate(
      id,
      { status: 'active' },
      { lean: true }
    )
  }
}

module.exports = UserRepository
