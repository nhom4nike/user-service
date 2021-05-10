const express = require('express')
const { header, validationResult } = require('express-validator')
const { auth: handler } = require('../controllers')

const { codes, format } = require('../utils/errors')

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

module.exports = { endpoint: '/', router }
