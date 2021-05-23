const errors = require('../utils/errors')

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
      if (password !== userModel.password) {
        throw errors.create(errors.codes.user.wrong_password, password)
      }

      const accessToken = await auth.aggregate.command(
        'generateAccessToken',
        userModel._id
      )
      const refreshToken = await auth.aggregate.command(
        'generateRefreshToken',
        userModel._id
      )
      await user.aggregate.command('updateRefreshToken', {
        id: userModel._id,
        refreshToken
      })

      return {
        accessToken,
        refreshToken,
        data: {
          id: userModel._id,
          email: userModel.email,
          crypt: userModel.crypt
        }
      }
    },

    // for verified route
    verify: async function (req) {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]
      // if (!token) {
      //   throw errors.create(errors.codes.auth.token_missing)
      // }

      const authData = await auth.projection.query('verifyAccessToken', token)
      const userId = authData.payload
      const userModel = await user.projection.query('get', { id: userId })
      return userModel
    },

    // for refresh token
    refresh: async function (req) {
      const token = req.body.refreshToken
      const payload = await auth.projection.query('verifyRefreshToken', token)
      const userId = payload.payload

      // check if refresh token is stored in user account
      const userModel = await user.projection.query('get', { id: userId })
      const isRefreshTokenValid = userModel.refreshToken === token
      if (!isRefreshTokenValid) {
        throw errors.create(errors.codes.auth.token_invalid, token)
      }

      // generate new Token
      const accessToken = await auth.aggregate.command(
        'generateAccessToken',
        userId
      )
      const refreshToken = await auth.aggregate.command(
        'generateRefreshToken',
        userId
      )
      // save new refresh token for user
      await user.aggregate.command('updateRefreshToken', {
        id: userId,
        refreshToken
      })

      return {
        accessToken,
        refreshToken
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
