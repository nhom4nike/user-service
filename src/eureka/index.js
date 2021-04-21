const { Eureka } = require('eureka-js-client')
const { networkInterfaces } = require('os')

const ipAddr = getIPAddress()
const eureka = new Eureka({
  // application instance information
  instance: {
    app: process.env.SERVICE_NAME,
    hostName: ipAddr,
    ipAddr,
    vipAddress: ipAddr,
    port: {
      $: `${process.env.PORT}`,
      '@enabled': true
    },
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    // eureka server host / port
    host: process.env.EUREKA_HOST,
    port: process.env.EUREKA_PORT,
    servicePath: '/eureka/apps',
    requestRetryDelay: 10000,
    maxRetries: Number.MAX_SAFE_INTEGER,
    preferIpAddress: true
  }
})

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

module.exports = eureka
