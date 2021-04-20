const express = require('express')
const helmet = require('helmet')
const { json } = require('body-parser')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const eureka = require('./eureka')

const server = express()
server.use(json())
server.use(cookieParser())
server.use(helmet())

routes.forEach((item) => {
  server.use(item.endpoint, item.router)
})

// register with eureka
eureka.start((error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }
})

module.exports = server
