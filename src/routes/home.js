const express = require('express')
const { body, validationResult, header } = require('express-validator')
const { home: handler } = require('../controllers')

const {
  format,
  parse,
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

    try {
      const userInfo = await handler.login(req)
      res.json(userInfo)
    } catch (error) {
      const known = parse(error)
      const status = known.code ? 400 : 500
      return res.status(status).json({ error: known })
    }
  }
)

router.post(
  '/token',
  body('token').exists().withMessage(reqCodes.missing_param),
  async (req, res, next) => {
    // request validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: format(errors) })
    }

    try {
      const accessToken = await handler.token(req)
      return res.json({ accessToken })
    } catch (error) {
      const known = parse(error)
      const status = known.code ? 400 : 500
      return res.status(status).json({ error: known })
    }
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

    try {
      const tokenDeleted = await handler.logout(req)
      return res.status(201).json(tokenDeleted._id)
    } catch (error) {
      const known = parse(error)
      const status = known.code ? 400 : 500
      return res.status(status).json({ error: known })
    }
  }
)
// for every route except /register /login /logout /token
// must add Header Token:  Authorization:  Bearer 'AccessToken'
router.use(
  '/',
  header('authorization', reqCodes.missing_header).exists(),
  async (req, res, next) => {
    try {
      const payload = await handler.verify(req)
      req.user = payload
      next()
    } catch (error) {
      const known = parse(error)
      const status = known.code ? 401 : 500
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

// catch 404
router.use(function (req, res, next) {
  return res.status(404).json({ error: { message: 'route not found' } })
})

module.exports = { endpoint: '/', router }
