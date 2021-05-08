const validator = require('validator').default
const { initTestDB } = require('@/utils/testing')
const UserRepository = require('@/cqrs/repositories/user.repository')
const UserModel = require('@/database/user.model')

/** @type {import('mongoose').Connection} */
let mongoose

let model
beforeAll(async () => {
  mongoose = await initTestDB('user_repository_test')
  model = UserModel(mongoose)
})

afterAll(async () => {
  await mongoose.close(true)
})

test('should these emails be valid', async () => {
  const valids = [
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.co.jp',
    'email@example.web',
    'email@example.museum',
    'あいうえお@example.com',
    'firstname-lastname@example.com'
  ]
  valids.forEach((email) => {
    const yes = validator.isEmail(email)
    expect(yes).toBeTruthy()
  })
})

test('should these email be invalid', async () => {
  const invalids = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'email@123.123.123.123',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    '.email@example.com',
    'email.@example.com',
    'email..email@example.com',
    'email@example.com (Joe Smith)',
    'email@example',
    'email@111.222.333.44444',
    'email@example..com',
    'Abc..123@example.com',
    'email@[123.123.123.123]'
  ]
  invalids.forEach((email) => {
    const yes = validator.isEmail(email)
    expect(yes).toBeFalsy()
  })
})

test('should password match regex', async () => {
  const strongs = [
    'YRwJt+45',
    'U4TsS9z@',
    '9!z.Zq=U',
    'GQAk_4&t',
    'Br8Lu43}',
    'z_{*27%Q',
    '(Y]2pjPJ',
    '98$P7Bc/',
    'QZ[7jJw{',
    'nxPv_jq4',
    'SU=4?5hV',
    'b7.+2M)?',
    '7KVZGA&f',
    'Wb-fZF5?',
    '(^RT3sW!',
    'z8g7^!HX',
    'xe^[P3Hp',
    'R6!QZcx.',
    '6=TM)XsK',
    '.Susan53',
    'T$7S6rJH'
  ]
  strongs.forEach((password) => {
    const yes = validator.isStrongPassword(password)
    expect(yes).toBeTruthy()
  })
})

test('should faild for weak password', async () => {
  const weaks = [
    '123456',
    '123456789',
    'picture1',
    'password',
    '12345678',
    '111111',
    '123123',
    '12345',
    '1234567890',
    'senha (Portuguese for password)',
    '1234567',
    'qwerty',
    'abc123',
    'Million2',
    '000000',
    '1234',
    'iloveyou',
    'aaron431',
    'password1',
    'qqww1122'
  ]
  weaks.forEach((password) => {
    const yes = validator.isStrongPassword(password)
    expect(yes).toBeFalsy()
  })
})

test('should email be unique', async () => {
  const users = new UserRepository(model)

  const task = users.create(
    { username: 'myname123', email: '123@gmail.com', password: '1' },
    true
  )
  const task1 = users.create(
    { username: 'myname', email: '123@gmail.com', password: '1' },
    true
  )
  Promise.all([task, task1])
    .catch(err => expect(err).toBeTruthy())
})

test('should username be unique', () => {
  const users = new UserRepository(model)

  const task = users.create(
    { username: 'myname', email: 'abc@gmail.com', password: '1' },
    true
  )
  const task1 = users.create(
    { username: 'myname', email: 'abcd@gmail.com', password: '1' },
    true
  )

  Promise.all([task, task1])
    .catch(err => expect(err).toBeTruthy())
})

test('should activate user', async () => {
  const users = new UserRepository(model)
  const id = await users.create(
    {
      username: 'my really Long Name',
      email: 'amy-fucking-emailk@gmail.com',
      password: '1'
    },
    true
  )
  await users.activate(id)

  const document = await users.model.findById(id, 'status', { lean: true })
  expect(document.status).toBeTruthy()
})
