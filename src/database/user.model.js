const { Schema, model } = require('mongoose')
const emailValidator = require('email-validator').validate

module.exports = model(
  'user',
  new Schema({
    email: {
      type: Schema.Types.String,
      required: true,
      validate: {
        validator: (s) => emailValidator(s),
        message: 'invalid email format'
      }
    },
    verified: { type: Schema.Types.Boolean, default: false },
    secret: {
      type: Schema.Types.String,
      index: true,
      minLength: 128,
      maxLength: 128,
      required: true
    },
    password: {
      type: Schema.Types.String,
      minLength: 128,
      maxLength: 128,
      required: true
    }
  })
)
