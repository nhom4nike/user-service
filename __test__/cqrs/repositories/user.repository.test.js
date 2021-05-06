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
    return target.create(
      {
        email,
        password: 'Manh@Tuan1999',
        verified: true
      },
      true
    )
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
    return target.create(
      {
        email,
        password: 'Manh@Tuan1999',
        verified: true
      },
      true
    )
  })
  expect(Promise.all(tasks)).rejects.toThrowError()
})

test('should password match regex', async () => {
  const users = new UserRepository(model)

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
    const yes = users.validate(password)
    expect(yes).toBeTruthy()
  })
})

test('should faild for weak password', async () => {
  const users = new UserRepository(model)
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
    const yes = users.validate(password)
    expect(yes).toBeFalsy()
  })
})

test('should verfied be optional', async () => {
  const users = new UserRepository(model)
  await users.create(
    {
      email: 'i.hope.this.email@is.val',
      password: 'Manh@Tuan1999'
    },
    true
  )
})
