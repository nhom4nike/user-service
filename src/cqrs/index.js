const { UserAggregate } = require('../cqrs/aggregates')
const { UserFactory } = require('../cqrs/factories')
const { UserProjection } = require('../cqrs/projections')
const { UserRepository } = require('../cqrs/repositories')
const UserModel = require('../database/user.model')

module.exports = function (mongoose) {
  const model = UserModel(mongoose)
  return {
    user: {
      projection: new UserProjection(new UserFactory(model)),
      aggregate: new UserAggregate(new UserRepository(model))
    }
  }
}
