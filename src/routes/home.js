const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  res.send('<h1>Welcome to User Service</h1>')
  return process.exit(1)
})

module.exports = { endpoint: '/', router }
