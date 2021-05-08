const { Kafka } = require('kafkajs')

class KafkaService {
    constructor(appName, brokerUris){
        this.appName = appName;
        this.brokerUris = brokerUris
        console.log('vo day', brokerUris)
        this.kafkaIntance = new Kafka({
            clientId: appName,
            brokers: brokerUris
          })
    }
    async init(){
        const producer = this.kafkaIntance.producer()
        const consumer = this.kafkaIntance.consumer({ groupId: `${this.appName}-group`})
        this.producer = producer
        this.consumer = consumer
        await this.producer.connect()
        await this.consumer.connect()
    }

    async sendMessage(topic,messages){
        try{
            await this.producer.send({ topic, messages })
        } catch(e){
            console.log("Kafka -> sendMessage error", e)
            throw new Error("Kafka sendMessage error")
        }
    }

    async consumeMessage(topic, callback){
      try{
        await this.consumer.subscribe({ topic: topic, fromBeginning: true }) 
        await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("received message from topic: ", topic)
                    callback(message.value.toString())
                },
              })
        } catch(e){
            console.log("Kafka -> consumeMessage error", e)
            throw new Error("Kafka consumeMessage error")
        }
    }
}

module.exports = KafkaService