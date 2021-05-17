const KafkaService = require('./kafka')

module.exports = new KafkaService(process.env.SERVICE_NAME, [
  process.env.KAFKA_HOST
])
