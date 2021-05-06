const express = require('express')
const helmet = require('helmet')
const { json } = require('body-parser')
const cookieParser = require('cookie-parser')
const eureka = require('./eureka')
const database = require('./database/config')

if (!process.env.EUREKA_DISABLE) eureka.start()

module.exports = {
  async setup() {
    // connect to database
    global.mongoose = await database.connect()

    // setup express server
    const server = express()
    server.use(json())
    server.use(cookieParser())
    server.use(helmet())

    // because each route uses mongoose models, mongoose must be connected to database
    const routes = require('./routes')
    routes.forEach((item) => {
      server.use(item.endpoint, item.router)
    })
    return server
  }
}
