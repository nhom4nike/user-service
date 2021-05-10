const express = require('express')
const { header, validationResult } = require('express-validator')
const { auth: handler } = require('../controllers')

const { parse, codes, format } = require('../utils/errors')

const router = express.Router()

// authorization middleware
router.use(
  '/',
  header('authorization', codes.req.missing_header).exists(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    return handler
      .verify(req)
      .then((user) => {
        req.user = user
        return next()
      })
      .catch(next)
  }
)

// 404 middleware
router.use('/', async (req, res) => {
  return res.status(404).json({
    error: {
      code: 'req/404-not-found',
      message: '404 resource not found',
      value: req.path
    }
  })
})

// error middleware
router.use('/', async (error, req, res, next) => {
  const known = parse(error)
  const status = known.code ? 400 : 500
  return res.status(status).json({ error: known })
})

module.exports = { endpoint: '/', router }
