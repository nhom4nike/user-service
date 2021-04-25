const express = require('express')
const UserAggregate = require('../cqrs/aggregates/user.aggregate')
const UserFactory = require('../cqrs/factories/user.factory')
const UserProjection = require('../cqrs/projections/user.projection')
const UserRepository = require('../cqrs/repositories/user.repository')
const UserModel = require('../database/user.model')

const router = express.Router()

router.get('/', async (req, res) => {
  res.send('<h1>Welcome to User Service</h1>')
})

router.get('/user/:id', async (req, res) => {
  try {
    const projection = new UserProjection(new UserFactory(UserModel))
    const user = await projection.handle({
      name: 'get',
      query: req.params
    })
    return user ? res.send(user) : res.status(404).send('user not found')
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return res.status(400).send('400 Bad Request')
    }
    return res.status(500).send('500 Internal Server Error')
  }
})

router.post('/user/create', async (req, res) => {
  try {
    const aggregate = new UserAggregate(new UserRepository(UserModel))
    const id = await aggregate.handle({
      name: 'create',
      payload: req.body
    })
    return res.send(id)
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return res.status(400).send('400 Bad Request')
    }
    return res.status(500).send('500 Internal Server Error')
  }
})

module.exports = { endpoint: '/', router }
