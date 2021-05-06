/**
 * @typedef {Object} UserRegistration
 * @property {string} email
 * @property {string} secret used for hashing user's raw password
 * @property {string} password 128-character hashed password
 * @property {boolean} verfied whether this user's email has been verified
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
   * @returns {Promise<string>} id of new user
   */
  async create(user) {
    const { email, secret, password, verified } = user
    const document = await this.model.create({
      email: email.trim(),
      secret,
      password,
      verified
    })
    return document.id
  }
}

module.exports = UserRepository
