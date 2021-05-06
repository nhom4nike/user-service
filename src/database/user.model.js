const email = require('email-validator')
const { Schema } = require('mongoose')

/**
 * @param {import('mongoose').Connection} mongoose
 */
module.exports = function (mongoose) {
  return mongoose.model(
    'user',
    new Schema({
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
          validator: (s) => email.validate(s),
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
      }
    })
  )
}
