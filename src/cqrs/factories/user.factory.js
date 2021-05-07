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
}

module.exports = UserFactory
