const { Schema, model } = require('mongoose')
const emailValidator = require('email-validator').validate

module.exports = model(
  'user',
  new Schema({
    email: {
      type: Schema.Types.String,
      required: true,
      index: true,
      unique: true,
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
