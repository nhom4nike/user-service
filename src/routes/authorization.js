const express = require('express')
const { body, validationResult } = require('express-validator')
const { auth: handler } = require('../controllers')

const {
  format,
  codes: { req: reqCodes }
} = require('../utils/errors')

const router = express.Router()

router.post(
  '/register',
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
    .withMessage(reqCodes.weak_password),
  async (req, res, next) => {
    // request validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    return handler
      .create(req)
      .then((id) => res.status(201).json({ id }))
      .catch(next)
  }
)

router.post(
  '/login',
  body('email').exists().withMessage(reqCodes.missing_param),
  body('password').exists().withMessage(reqCodes.missing_param),
  async (req, res, next) => {
    // request validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    return handler
      .login(req)
      .then((user) => res.json(user))
      .catch(next)
  }
)

router.post(
  '/refresh',
  body('token').exists().withMessage(reqCodes.missing_param),
  async (req, res, next) => {
    // request validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    return handler
      .refresh(req)
      .then((accessToken) => res.json({ accessToken }))
      .catch(next)
  }
)
router.delete(
  '/logout',
  body('token').exists().withMessage(reqCodes.missing_param),
  async (req, res, next) => {
    // request validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    return handler
      .logout(req)
      .then(({ _id }) => res.json({ _id }))
      .catch(next)
  }
)

router.get('/info', async (req, res) => {
  res.json(req.user)
})

module.exports = { endpoint: '/', router }