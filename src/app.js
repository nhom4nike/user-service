const express = require('express')
const helmet = require('helmet')
const { json } = require('body-parser')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const eureka = require('./eureka')
const database = require('./database/config')

if (!process.env.EUREKA_DISABLE) eureka.start()

module.exports = {
  async setup() {
    // connect to database
    await database.connect()

    // setup express server
    const server = express()
    server.use(json())
    server.use(cookieParser())
    server.use(helmet())

    routes.forEach((item) => {
      server.use(item.endpoint, item.router)
    })
    return server
  }
}
