const express = require('express')
const cqrs = require('../cqrs')(global.mongoose)

const router = express.Router()

router.get('/', async (req, res) => {
  res.send('<h1>Welcome to User Service</h1>')
})

router.post('/create', async (req, res) => {
  try {
    const { aggregate } = cqrs.user
    const id = await aggregate.handle({
      name: 'create',
      payload: req.body
    })
    return res.json({ id })
  } catch (error) {
    const [, code] = error.message.split('/')
    if (code) return res.status(400).send({ error: code })
    else if (error.name === 'ValidationError') {
      return res.status(400).send({ error: error.message })
    }
    console.error(error)
    return res.status(500).send('500 Internal Server Error')
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { projection } = cqrs.user
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

module.exports = { endpoint: '/', router }
