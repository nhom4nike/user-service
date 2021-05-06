const mongoose = require('mongoose')
const { UserAggregate } = require('../cqrs/aggregates')
const { UserFactory } = require('../cqrs/factories')
const { UserProjection } = require('../cqrs/projections')
const { UserRepository } = require('../cqrs/repositories')
const { UserModel } = require('../database')

module.exports = {
  user: {
    projection: new UserProjection(new UserFactory(UserModel(mongoose))),
    aggregate: new UserAggregate(new UserRepository(UserModel(mongoose)))
  }
}
