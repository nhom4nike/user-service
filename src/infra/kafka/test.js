const Kafka = require('./index')

const userService = new Kafka('user-service', ['04-nike.tk:9092'])
const topName = 'user-topic'
let i = 0
const main = async () => {
  await userService.init()
  setInterval(() => {
    userService.sendMessage(topName, [{ value: `value: ${i++}` }])
    console.log('Send message value: ', i)
  }, 3000)

  userService.consumeMessage(topName, (message) =>
    console.log('Message received: ', message)
  )
}

main()
