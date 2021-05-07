const { body, validationResult } = require('express-validator')
const express = require('express')
const cqrs = require('../cqrs')(global.mongoose)
const {
  format,
  parse,
  codes: { req: reqCodes }
} = require('../utils/errors')

const router = express.Router()

router.post(
  '/',
  body('email')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(reqCodes.missing_param)
    .isEmail()
    .withMessage(reqCodes.invalid_email)
    .normalizeEmail(),
  body('username')
    .exists()
    .withMessage(reqCodes.missing_param)
    .isString()
    .withMessage(reqCodes.type_mismatch)
    .trim(),
  body('password')
    .exists()
    .withMessage(reqCodes.missing_param)
    .isStrongPassword()
    .withMessage('password is too weak'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    try {
      const { aggregate } = cqrs.user
      const id = await aggregate.command('create', req.body)
      return res.status(201).json({ id })
    } catch (error) {
      const { code, source } = parse(error.message)
      if (code) {
        return res.status(400).send({
          error: {
            code,
            source
          }
        })
      }
      console.error(error)
      return res.status(500).send('500 Internal Server Error')
    }
  }
)

router.get('/:id', async (req, res) => {
  try {
    const { projection } = cqrs.user
    const user = await projection.query('get', req.params)
    return res.json(user)
  } catch (error) {
    const known = parse(error.message)
    if (known.code === 'unknown') {
      console.error(error)
      return res.status(500).json({ error: known })
    }
    return res.status(400).json({ error: known })
  }
})

module.exports = { endpoint: '/', router }
