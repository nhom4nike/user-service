// const index = require('./home')
const security = require('./security')
const authorization = require('./authorization')
// const verification = require('./verification')

module.exports = [authorization].concat(security)
