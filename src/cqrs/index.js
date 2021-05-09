const { UserAggregate, AuthAggregate } = require('../cqrs/aggregates')
const { UserFactory, AuthFactory } = require('../cqrs/factories')
const { UserProjection, AuthProjection } = require('../cqrs/projections')
const { UserRepository, AuthRepository } = require('../cqrs/repositories')

class CQRS {
  /**
   * @typedef {import('mongoose').Model} Model
   * @param {Object} models mongoose's models
   * @param {Model} models.user
   * @param {Model} models.auth
   */
  constructor({ user, auth }) {
    this.user = {
      projection: new UserProjection(new UserFactory(user)),
      aggregate: new UserAggregate(new UserRepository(user))
    }

    this.auth = {
      projection: new AuthProjection(new AuthFactory(auth)),
      aggregate: new AuthAggregate(new AuthRepository(auth))
    }
  }
}
module.exports = CQRS
