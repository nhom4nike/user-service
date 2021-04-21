const express = require('express')
const eureka = require('../eureka')

const router = express.Router()

router.get('/exit', async (req, res) => {
  // clean things up before shutdown
  eureka.stop((error) => {
    if (error) {
      console.error(error)
      res
        .status(500)
        .send(`<h1>Server shutdown with error</h1><p>${error.message}</p>`)
        .end(() => process.exit(1))
    } else {
      res
        .status(200)
        .send('<h1>Server shutdown gracefully</h1>')
        .end(process.exit(0))
    }
  })
})

module.exports = { endpoint: '/security', router }
