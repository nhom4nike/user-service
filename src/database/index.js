const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGO_CONNECTION_STRING,
  {
    dbName: process.env.MONGO_DBNAME,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  (err) => {
    if (!err) {
      console.log('MongoDB Connection Succeeded.')
    } else {
      console.error('Error in DB connection: ' + err)
    }
  }
)

module.exports = mongoose
