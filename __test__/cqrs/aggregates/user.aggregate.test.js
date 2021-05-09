const UserAggregate = require('@/cqrs/aggregates/user.aggregate')
const UserRepository = require('@/cqrs/repositories/user.repository')

const mockCreate = jest.fn()
jest.mock('@/cqrs/repositories/user.repository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      create: mockCreate
    }
  })
})

beforeEach(() => {
  UserRepository.mockClear()
  mockCreate.mockClear()
})

test('should constructors be called', () => {
  const aggregate = new UserAggregate(new UserRepository())
  expect(aggregate).toBeTruthy()
  expect(UserRepository).toBeCalledTimes(1)
})

test('should create fucntion be called', async () => {
  const aggregate = new UserAggregate(new UserRepository())
  await aggregate.command('create', {
    username: '1',
    email: '1',
    password: '1'
  })
  expect(mockCreate).toBeCalledTimes(1)
  expect(mockCreate).toBeCalledWith({
    username: '1',
    email: '1',
    password: '1'
  })
})
