const UserModel = require('../database/user.model')(global.mongoose)
const AuthModel = require('../database/auth.model')(global.mongoose)
const CQRS = require('../cqrs')

const cqrs = new CQRS({ user: UserModel, auth: AuthModel })

module.exports = {
  auth: require('./auth.controller')(cqrs)
}
