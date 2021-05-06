const { Schema } = require('mongoose')

/**
 * @param {import('mongoose').Connection} mongoose
 */
module.exports = function (mongoose) {
  return mongoose.model(
    'user',
    new Schema({
      email: {
        type: Schema.Types.String,
        required: true,
        index: true,
        unique: true,
        validate: {
          validator: (s) => s.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g),
          message: 'user-model/invalid-email'
        }
      },
      verified: { type: Schema.Types.Boolean, default: false },
      secret: {
        type: Schema.Types.String,
        index: true,
        minLength: 128,
        maxLength: 255,
        required: true
      },
      password: {
        type: Schema.Types.String,
        minLength: 64,
        maxLength: 255,
        required: true
      }
    })
  )
}
