const express = require('express')
const helmet = require('helmet')
const { json } = require('body-parser')
const cookieParser = require('cookie-parser')
const eureka = require('./eureka')
const database = require('./database/config')
const cors = require('cors')
const { parse } = require('./utils/errors')
const kafka = require('./kafka')

if (!process.env.EUREKA_DISABLE) eureka.start()

module.exports = {
  async setup() {
    // connect to database, this must be call before importing any routes
    console.log('connecting to database...')
    global.mongoose = await database.connect()

    console.log('initialize kafka service...')
    await kafka.init()

    // setup express server
    const server = express()
    server.use(json())
    server.use(cookieParser())
    server.use(helmet())
    server.use(cors())

    // because each route uses mongoose models, mongoose must be connected to database
    const routes = require('./routes')
    routes.forEach((item) => {
      server.use(item.endpoint, item.router)
    })

    // 404 middleware
    server.use('/', async (req, res) => {
      return res.status(404).json({
        error: {
          code: 'req/404-not-found',
          message: '404 resource not found',
          value: req.path
        }
      })
    })

    // error middleware
    server.use('/', async (error, req, res, next) => {
      const known = parse(error)
      const status = known.code ? 400 : 500
      return res.status(status).json({ error: known })
    })

    return server
  }
}
