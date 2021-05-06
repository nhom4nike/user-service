const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const express = require('express')
const {
  user: { projection }
} = require('../cqrs')(global.mongoose)

const router = express.Router()

router.post(
  '/',
  body('id', 'missing required parameter')
    .exists({
      checkFalsy: true,
      checkNull: true
    })
    .isString()
    .trim(),
  async (req, res) => {
    // check request's parameters
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = errors
        .formatWith((error) => {
          return { message: error.msg, parameter: error.param }
        })
        .array({ onlyFirstError: true })[0]
      return res.status(400).json({ error })
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
