const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const express = require('express')
const CQRS = require('../cqrs')
const {
  user: { projection }
} = new CQRS(global.mongoose)
const {
  codes: { req },
  format
} = require('../utils/errors')

const router = express.Router()

router.post(
  '/',
  body('id', req.missing_param).exists({
    checkFalsy: true,
    checkNull: true
  }),
  async (req, res) => {
    // check request's parameters
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    // find user
    const user = await projection.query('get', req.body)
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'user not found'
        }
      })
    }

    // verifed user
    if (user.status === 'active') {
      return res.json({
        message: 'email has already been verify',
        code: 'email-verified'
      })
    }

    // not verifed user
    const token = jwt.sign({ email: user.email }, user.secret.toString(), {
      expiresIn: 300,
      issuer: user._id.toString(),
      subject: 'verify email'
    })
    return res.json({ jwt: token })
  }
)

module.exports = { endpoint: '/verify', router }
