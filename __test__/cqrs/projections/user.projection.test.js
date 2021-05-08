const UserProjection = require('@/cqrs/projections/user.projection')
const UserFactory = require('@/cqrs/factories/user.factory')

const mockGet = jest.fn()
jest.mock('@/cqrs/factories/user.factory', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: mockGet
    }
  })
})

beforeEach(() => {
  UserFactory.mockClear()
  mockGet.mockClear()
})

test('should constructor be call', () => {
  const projection = new UserProjection(new UserFactory())
  expect(projection).toBeTruthy()
  expect(UserFactory).toBeCalledTimes(1)
})

test('should get fucntion be called', async () => {
  const projection = new UserProjection(new UserFactory())
  await projection.query('get', {
    id: '1'
  })
  expect(mockGet).toBeCalledTimes(1)
  expect(mockGet).toBeCalledWith('1')
})

test('should fail if using unknown command', async () => {
  const projection = new UserProjection(new UserFactory())
  const task = projection.query('some-command-i-dont-known')
  await expect(task).rejects.toThrowError()
})
