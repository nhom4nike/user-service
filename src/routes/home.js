const { body, validationResult } = require('express-validator')
const express = require('express')
const cqrs = require('../cqrs')(global.mongoose)
const handler = require('../controllers/home.controller')(cqrs)
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
    // request validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    try {
      const id = await handler.create(req)
      return res.status(201).json({ id })
    } catch (error) {
      const known = parse(error)
      const status = known.code ? 400 : 500
      return res.status(status).json({ error: known })
    }
  }
)

router.get('/:id', async (req, res) => {
  try {
    const user = await handler.get(req)
    return res.json(user)
  } catch (error) {
    const known = parse(error)
    const status = known.code ? 400 : 500
    return res.status(status).json({ error: known })
  }
})

module.exports = { endpoint: '/', router }
