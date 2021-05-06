const validator = require('validator').default
const { Schema } = require('mongoose')

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
          index: true,
          unquie: true
        },
        email: {
          type: Schema.Types.String,
          required: true,
          index: true,
          unique: true,
          validate: {
            validator: (s) => validator.isEmail(s),
            message: 'user-model/invalid-email'
          }
        },
        secret: {
          type: Schema.Types.String,
          required: true
        },
        password: {
          type: Schema.Types.String,
          required: true
        },
        status: {
          type: Schema.Types.String,
          default: 'inactive'
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
