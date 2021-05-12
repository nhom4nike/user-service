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
        status: {
          type: Schema.Types.String,
          default: 'inactive',
          select: true
        },
        password: {
          type: Schema.Types.String,
          required: true
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
