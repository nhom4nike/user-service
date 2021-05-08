const errors = require('../../utils/errors')

/** business logic for read operations */
class UserFactory {
  constructor(model) {
    this.model = model
  }

  async get(id) {
    const user = await this.model.findById(id).lean()
    if (!user) throw errors.create('user', 'not-found', id)
    return user
  }

  async findByEmail(email) {
    return await this.model.findOne({ email }) || null

    // if (!user) {
    //   throw errors.create(errors.codes.login.invalid_email, email)
    // }
    // if (!bcrypt.compareSync(password, user.password)) {
    //   throw errors.create(errors.codes.login.invalid_password, password)
    // }
  }
}

module.exports = UserFactory
