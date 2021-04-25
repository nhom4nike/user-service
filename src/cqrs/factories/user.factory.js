/** buiness logic for read operations */
class UserFactory {
  /**
   * @param {import('../../database/user.model')} model mongoose user model
   */
  constructor(model) {
    this.model = model
  }

  async get({ id = '' }) {
    return this.model.findById(id).lean()
  }
}

module.exports = UserFactory
