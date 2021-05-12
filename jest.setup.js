// load environment variables
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV
dotenv.config({
  path: environment === 'test' ? '.env.test' : '.env.development'
})
