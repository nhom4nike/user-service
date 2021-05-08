const { UserAggregate, AuthAggregate } = require('../cqrs/aggregates')
const { UserFactory, AuthFactory } = require('../cqrs/factories')
const { UserProjection, AuthProjection } = require('../cqrs/projections')
const { UserRepository, AuthRepository } = require('../cqrs/repositories')
const UserModel = require('../database/user.model')
const AuthModel = require('../database/auth.model')

let userModel
let authModel
module.exports = function (mongoose) {
  if (!userModel) userModel = UserModel(mongoose)
  if (!authModel) authModel = AuthModel(mongoose)
  return {
    user: {
      projection: new UserProjection(new UserFactory(userModel)),
      aggregate: new UserAggregate(new UserRepository(userModel))
    },
    auth: {
      projection: new AuthProjection(new AuthFactory(userModel, authModel)),
      aggregate: new AuthAggregate(new AuthRepository(authModel))
    }
  }
}
