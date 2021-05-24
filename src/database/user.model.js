const validator = require('validator').default
const { Schema } = require('mongoose')
const {
  codes: { user }
} = require('../utils/errors')

/**
 * @param {import('mongoose').Connection} mongoose
 */
module.exports = function (mongoose) {
  return mongoose.model(
    'user',
    new Schema(
      {
        username: {
          type: Schema.Types.String,
          required: true,
          unique: true,
          select: true
        },
        email: {
          type: Schema.Types.String,
          required: true,
          unique: true,
          select: true,
          validate: {
            validator: (s) => validator.isEmail(s),
            message: user.invalid_email
          }
        },
        password: {
          type: Schema.Types.String,
          required: true
        },
        firstName: {
          type: Schema.Types.String,
          default: ''
        },
        lastName: {
          type: Schema.Types.String,
          default: ''
        },
        telephone: {
          type: Schema.Types.String,
          default: ''
        },
        position: {
          type: Schema.Types.String,
          default: ''
        },
        status: {
          type: Schema.Types.String,
          default: 'inactive',
          select: true
        },
        publicKey: {
          type: Schema.Types.String,
          required: true
        },
        crypt: {
          type: Schema.Types.String,
          required: true
        },
        refreshToken: {
          type: Schema.Types.String,
          default: ''
        }
      },
      {
        timestamps: {
          createdAt: 'created_at',
          updatedAt: 'updated_at'
        }
      }
    )
  )
}
