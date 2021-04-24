class UserFactory {
  /**
   * @param {import('../../database/user.model')} model mongoose user model
   */
  constructor(model) {
    this.model = model
  }

  async getAll() {
    const results = await this.model.find()
    return results
  }
}

module.exports = UserFactory
