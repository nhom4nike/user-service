const { Schema } = require('mongoose')

module.exports = function (mongoose) {
  return mongoose.model(
    'auth',
    new Schema(
      {
        token: {
          type: Schema.Types.String,
          immutable: true,
          required: true,
          index: true,
          unique: true
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
