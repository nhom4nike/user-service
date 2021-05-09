const { UserAggregate, AuthAggregate } = require('../cqrs/aggregates')
const { UserFactory, AuthFactory } = require('../cqrs/factories')
const { UserProjection, AuthProjection } = require('../cqrs/projections')
const { UserRepository, AuthRepository } = require('../cqrs/repositories')
const UserModel = require('../database/user.model')
const AuthModel = require('../database/auth.model')

class CQRS {
  constructor(mongoose) {
    const userModel = UserModel(mongoose)
    const authModel = AuthModel(mongoose)

    this.user = {
      projection: new UserProjection(new UserFactory(userModel)),
      aggregate: new UserAggregate(new UserRepository(userModel))
    }

    this.auth = {
      projection: new AuthProjection(new AuthFactory(authModel)),
      aggregate: new AuthAggregate(new AuthRepository(authModel))
    }
  }
}
module.exports = CQRS
