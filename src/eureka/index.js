const { Eureka } = require('eureka-js-client')

const eureka = new Eureka({
  // application instance information
  instance: {
    app: 'user-service',
    hostName: 'localhost',
    ipAddr: 'localhost',
    vipAddress: 'localhost',
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
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps'
  }
})

module.exports = eureka
