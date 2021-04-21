const { networkInterfaces } = require('os')
function getIPAddress() {
  const nets = networkInterfaces()
  const results = Object.create(null) // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = []
        }
        results[name].push(net.address)
      }
    }
  }

  for (const key in results) {
    if (Object.hasOwnProperty.call(results, key)) {
      const element = results[key]
      return element[0]
    }
  }
  return '0.0.0.0'
}
module.exports = { getIPAddress, ipv4: getIPAddress() }
