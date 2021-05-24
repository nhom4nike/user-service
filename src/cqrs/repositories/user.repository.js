const validator = require('validator').default
const errors = require('../../utils/errors')

/**
 * @typedef {Object} UserRegistration
 * @property {string} email
 * @property {string} username
 * @property {string} password bcrypted password sent from client, no need to hash
 * @property {string} public_key
 * @property {string} crypt private key
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
  async create(
    {
      username,
      email,
      password,
      firstName,
      lastName,
      telephone,
      position,
      publicKey,
      crypt
    },
    test = false
  ) {
    if (process.env.NODE_ENV === 'production' && test) {
      console.error(
        'test mode should only be used in test environment, terminate process'
      )
      return process.exit(-1)
    }

    if (!test) {
      // perform validation
      if (!validator.isEmail(email)) {
        throw errors.create(errors.codes.user.invalid_email, email)
      }
    }

    const document = await this.model.create({
      username: username.trim(),
      email: email.trim(),
      password,
      firstName,
      lastName,
      telephone,
      position,
      publicKey,
      crypt
    })
    return document.id
  }

  async activate(id) {
    return this.model.findByIdAndUpdate(
      id,
      { status: 'active' },
      { lean: true }
    )
  }

  async update(id, newData) {
    return this.model.findByIdAndUpdate(id, newData)
  }
}

module.exports = UserRepository
