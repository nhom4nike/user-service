const errors = require('../utils/errors')
const bcrypt = require('bcrypt')

/**
 * controller for home.route
 * @param {import('../cqrs')} cqrs
 */

module.exports = function handler({ user, auth }) {
  return {
    create: async function (req) {
      const { aggregate } = user
      return aggregate.command('create', req.body)
    },
    get: async function (req) {
      const { projection } = user
      return projection.query('get', req.params)
    },

    login: async function (req) {
      const { email, password } = req.body
      const userModel = await user.projection.query('findByEmail', email)

      if (!userModel) {
        throw errors.create(errors.codes.user.wrong_email, email)
      }
      if (!bcrypt.compareSync(password, userModel.password)) {
        throw errors.create(errors.codes.user.wrong_password, password)
      }

      const accessToken = await auth.aggregate.command(
        'generateAccessToken',
        userModel
      )
      const refreshToken = await auth.aggregate.command(
        'generateRefreshToken',
        userModel
      )

      return {
        id: userModel.id,
        email: userModel.email,
        accessToken,
        refreshToken
      }
    },

    // for verified route
    verify: async function (req) {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]
      if (!token) {
        throw errors.create(errors.codes.auth.token_missing)
      }

      try {
        const authData = await auth.projection.query('verifyAccessToken', token)
        return authData.payload
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw errors.create(errors.codes.auth.token_expired, token)
        }
        if (error.name === 'JsonWebTokenError') {
          throw errors.create(errors.codes.auth.token_invalid, token)
        }
      }
    },

    // for refresh token
    refresh: async function (req) {
      const tokenModel = await auth.projection.query('get', req.body)
      if (!tokenModel) {
        throw errors.create(errors.codes.auth.token_invalid, req.body.token)
      }

      try {
        const payload = await auth.projection.query(
          'verifyRefreshToken',
          tokenModel.token
        )
        return await auth.aggregate.command('generateAccessToken', payload)
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw errors.create(errors.codes.auth.token_expired, tokenModel.token)
        }
        if (error.name === 'JsonWebTokenError') {
          throw errors.create(errors.codes.auth.token_invalid, tokenModel.token)
        }
      }
    },

    // delete refresh token
    logout: async function (req) {
      const tokenModel = await auth.aggregate.command(
        'deleteToken',
        req.body.token
      )
      if (!tokenModel) {
        throw errors.create(errors.codes.auth.token_invalid)
      }
    }
  }
}
