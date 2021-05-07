const mongoose = require('mongoose')

module.exports = {
  initTestDB: async function (name) {
    const instance = mongoose.createConnection(
      process.env.MONGO_CONNECTION_STRING,
      {
        dbName: name,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    )
    await instance.dropDatabase()
    return instance
  }
}
