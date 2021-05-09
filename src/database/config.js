const mongoose = require('mongoose')

async function connect() {
  return mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {
      dbName: process.env.MONGO_DBNAME,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then((instance) => {
      console.log('MongoDB Connection Succeeded.')
      instance.pluralize(null)
      return instance
    })
    .catch((error) => console.error('Error in DB connection: ' + error))
}

module.exports = { connect, mongoose }
