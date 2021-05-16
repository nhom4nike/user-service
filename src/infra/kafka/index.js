const { Kafka } = require('kafkajs')
class KafkaSingleton {
  constructor(appName, brokerUris) {
    this.appName = appName
    this.brokerUris = brokerUris
    this.kafka_Instance = new Kafka({
      clientId: appName,
      brokers: brokerUris
    })
  }

  async init() {
    const producer = this.kafka_Instance.producer()
    const consumer = this.kafka_Instance.consumer({
      groupId: `${this.appName}-group`
    })
    this.producer = producer
    this.consumer = consumer
    await this.producer.connect()
    await this.consumer.connect()
  }

  async sendMessage(topic, messages) {
    try {
      await this.producer.send({ topic, messages })
    } catch (e) {
      console.log('Kafka -> sendMessage error', e)
      throw new Error('Kafka sendMessage error')
    }
  }

  async consumeMessage(topic, callback) {
    try {
      await this.consumer.subscribe({ topic: topic, fromBeginning: true })
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log('received message from topic: ', topic)
          callback(message.value.toString())
        }
      })
    } catch (e) {
      console.log('Kafka -> consumeMessage error', e)
      throw new Error('Kafka consumeMessage error')
    }
  }
}
class KafkaService {
  constructor(appName, brokerUris) {
    throw new Error('Use Singleton.getInstance()')
  }

  static getInstance(appName, brokerUris) {
    console.error('KafkaService.instance: ' + !KafkaService.instance)
    if (!KafkaService.instance) {
      KafkaService.instance = new KafkaSingleton(appName, brokerUris)
    }
    return KafkaService.instance
  }
}

module.exports = KafkaService
