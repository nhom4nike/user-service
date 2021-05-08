const errors = require('../utils/errors')
const bcrypt = require('bcrypt')

module.exports = function handler({ user, auth }) {
  return {
    create: async function (req) {
      const { aggregate } = user
      return aggregate.command('create', req.body)
    },
    get: async function (req) {
      const { projection } = user
      return projection.query('get', req.params)
    },

    login: async function (req) {
      const { email, password } = req.body
      const userModel = await user.projection.query('findByEmail', email)

      if (!userModel) {
        throw errors.create(errors.codes.login.invalid_email, email)
      }
      if (!bcrypt.compareSync(password, userModel.password)) {
        throw errors.create(errors.codes.login.invalid_password, password)
      }

      const authModel = await auth.aggregate.command('sign', userModel)

      return {
        id: userModel.id,
        email: userModel.email,
        token: authModel.token
      }
    }
  }
}
