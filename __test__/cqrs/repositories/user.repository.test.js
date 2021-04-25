const sha512 = require('crypto-js/hmac-sha512')
const base64 = require('crypto-js/enc-base64')
const random = require('crypto-random-string')

const database = require('@/database/config')
const UserRepository = require('@/cqrs/repositories/user.repository')
const UserModel = require('@/database/user.model')

beforeAll(async () => {
  await database.connect()
})

afterAll(async () => {
  await database.mongoose.disconnect()
})

test('should create a document', async () => {
  const target = new UserRepository(UserModel)
  await target.create({
    email: 'valid@gmail.com',
    secret: random(128),
    password: random(128),
    verified: true
  })
})
