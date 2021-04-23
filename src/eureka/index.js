const { Eureka } = require('eureka-js-client')
const { ipv4 } = require('../utils/network')

let hostIp = process.env.NODE_ENV === 'production' ? process.env.EUREKA_HOST : ipv4;
const eureka = new Eureka({
  // application instance information
  instance: {
    app: process.env.SERVICE_NAME,
    instanceId: `${hostIp}:${process.env.SERVICE_NAME}:${process.env.PORT}`,
    hostName: hostIp,
    ipAddr: hostIp,
    vipAddress: process.env.SERVICE_NAME,
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

module.exports = eureka
