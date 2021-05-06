const { body, validationResult } = require('express-validator')
const express = require('express')
const cqrs = require('../cqrs')(global.mongoose)
const { format, parse } = require('../utils/errors')

const router = express.Router()

router.post(
  '/',
  body('email')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('missing required parameter')
    .isEmail()
    .withMessage('invalid email format')
    .normalizeEmail(),
  body('username', 'missing required parameter').exists().isString(),
  body('password')
    .exists()
    .withMessage('missing required parameter')
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
})

module.exports = { endpoint: '/', router }
