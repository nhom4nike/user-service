const { Kafka } = require('kafkajs')

class KafkaService {
  /**
   * @param {string} name the name of service
   * @param {string[]} brokers the uris of brokers
   */
  constructor(name, brokers) {
    this.name = name
    this.brokers = brokers
    this.kafka = new Kafka({
      clientId: name,
      brokers: brokers
    })
  }

  async init() {
    const producer = this.kafka.producer()
    const consumer = this.kafka.consumer({
      groupId: `${this.name}-group`
    })
    this.producer = producer
    this.consumer = consumer
    await this.producer.connect()
    await this.consumer.connect()
  }

  /**
   * send a topic to kafka server
   * @param {'USER-CREATE'} topic
   * @param {Object[]} messages payload
   */
  async send(topic, messages) {
    await this.producer.send({ topic, messages })
  }

  /**
   * subscribe specific topics
   * @param {string[]} topics list of topics to subscribe
   */
  async subscribe(topics) {
    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: true })
    }
    await this.consumer.run({
      eachMessage: this.handle
    })
  }

  /**
   * handle incoming message
   * @param {string} topic
   * @param {Object} payload
   */
  async handle({ topic, message }) {
    console.log({
      topic,
      offset: message.offset,
      value: message.value.toString()
    })
  }
}

module.exports = KafkaService
