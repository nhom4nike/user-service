const random = require('crypto-random-string')
const { initiTestDB } = require('@/utils/testing')
const UserRepository = require('@/cqrs/repositories/user.repository')
const UserModel = require('@/database/user.model')

/** @type {import('mongoose').Connection} */
let mongoose

let model
beforeAll(async () => {
  mongoose = await initiTestDB('user_repository_test')
  model = UserModel(mongoose)
})

afterAll(async () => {
  await mongoose.close(true)
})

test('should these emails be valid', async () => {
  const target = new UserRepository(model)
  const valids = [
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'email@123.123.123.123',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.co.jp',
    'firstname-lastname@example.com'
  ]

  const tasks = valids.map((email) => {
    return target.create({
      email,
      secret: random(128),
      password: random(128),
      verified: true
    })
  })
  await Promise.all(tasks)
})

test('should these email be invalid', async () => {
  const target = new UserRepository(model)

  const invalids = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    '.email@example.com',
    'email.@example.com',
    'email..email@example.com',
    'あいうえお@example.com',
    'email@example.com (Joe Smith)',
    'email@example',
    'email@-example.com',
    'email@example.web',
    'email@111.222.333.44444',
    'email@example..com',
    'Abc..123@example.com',
    'email@[123.123.123.123]',
    'email@example.museum',
    'firstname+lastname@example.com'
  ]
  const tasks = invalids.map((email) => {
    return target.create({
      email,
      secret: random(128),
      password: random(128),
      verified: true
    })
  })
  expect(Promise.all(tasks)).rejects.toThrowError()
})

test('should success if secret is in range [128,255]', async () => {
  const users = new UserRepository(model)
  const secret1 = random(128)
  const secret2 = random(255)

  await users.create({
    secret: secret1,
    email: random(12) + '@email.com',
    password: random(128)
  })
  await users.create({
    secret: secret2,
    email: random(16) + 'ddrgnjkjnr@email.com',
    password: random(128)
  })
})

test('should fail if secret is out of range [128,255]', async () => {
  const users = new UserRepository(model)
  const secret1 = random(127)
  const secret2 = random(256)

  const failedTask1 = users.create({
    secret: secret1,
    email: random(16) + 'ddrgnjkjnr@email.com',
    password: random(128)
  })
  const failedTask2 = users.create({
    secret: secret2,
    email: random(16) + 'ddrgnjkjnr@email.com',
    password: random(128)
  })
  expect(Promise.all([failedTask1, failedTask2])).rejects.toThrowError()
})

test('should success if password is in range [64,255]', async () => {
  const users = new UserRepository(model)
  const password1 = random(64)
  const password2 = random(255)

  await users.create({
    password: password1,
    email: random(12) + '@email.com',
    secret: random(128)
  })
  await users.create({
    password: password2,
    email: random(16) + 'ddrgnjkjnr@email.com',
    secret: random(128)
  })
})

test('should fail if password is out of range [64,255]', async () => {
  const users = new UserRepository(model)
  const password3 = random(63)
  const password4 = random(256)

  const failedTask1 = users.create({
    password: password3,
    email: random(16) + 'ddrgnjkjnr@email.com',
    secret: random(128)
  })
  const failedTask2 = users.create({
    password: password4,
    email: random(16) + 'ddrgnjkjnr@email.com',
    secret: random(128)
  })
  expect(Promise.all([failedTask1, failedTask2])).rejects.toThrowError()
})

test('should verfied be optional', async () => {
  const users = new UserRepository(model)
  await users.create({
    email: 'i.hope.this.email@is.val',
    password: random(128),
    secret: random(128)
  })
})
