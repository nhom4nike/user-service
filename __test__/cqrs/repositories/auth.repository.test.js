const { initTestDB } = require('@/utils/testing')

/** @type {import('mongoose').Connection} */
let mongoose

beforeAll(async () => {
  mongoose = await initTestDB('auth_repository_test')
})

afterAll(async () => {
  await mongoose.close(true)
})

test('should pass', () => {
  expect(true).toBeTruthy()
})
