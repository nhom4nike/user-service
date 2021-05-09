const HomeController = require('@/controllers/home.controller')
const UserAggregate = require('@/cqrs/aggregates/user.aggregate')
const UserProjection = require('@/cqrs/projections/user.projection')

const mockCommand = jest.fn()
const mockQuery = jest.fn()
jest.mock('@/cqrs/aggregates/user.aggregate', () => {
  return jest.fn().mockImplementation(() => {
    return {
      command: mockCommand
    }
  })
})
jest.mock('@/cqrs/projections/user.projection', () => {
  return jest.fn().mockImplementation(() => {
    return {
      query: mockQuery
    }
  })
})
beforeEach(() => {
  UserAggregate.mockClear()
  UserProjection.mockClear()
  mockCommand.mockClear()
  mockQuery.mockClear()
})

describe('commands', () => {
  test('should call create and if req is destructible', async () => {
    const handler = HomeController({
      user: { aggregate: new UserAggregate() }
    })

    const inputs = [
      '1',
      1,
      true,
      false,
      new Error(),
      { body: 'payload' },
      { body: null },
      { body: undefined },
      new Error()
    ]
    for (let i = 0; i < inputs.length; i++) {
      const req = inputs[i]
      await handler.create(req)
      expect(mockCommand).toBeCalledTimes(i + 1)
      expect(mockCommand).toBeCalledWith('create', req.body)
    }
  })

  test('should call create and fail if req is indestructible', async () => {
    const handler = HomeController({
      user: { aggregate: new UserAggregate() }
    })
    const inputs = [null, undefined]
    for (let i = 0; i < inputs.length; i++) {
      const req = inputs[i]
      const task = handler.create(req)
      await expect(task).rejects.toThrowError(TypeError)
    }
    expect(mockCommand).toBeCalledTimes(0)
  })
})

describe('queries', () => {
  test('should call get and use req.params', async () => {
    const handler = HomeController({
      user: { projection: new UserProjection() }
    })
    const inputs = [
      '1',
      1,
      true,
      false,
      new Error(),
      { params: 'payload' },
      { params: null },
      { params: undefined },
      new Error()
    ]
    for (let i = 0; i < inputs.length; i++) {
      const req = inputs[i]
      await handler.get(req)
      expect(mockQuery).toBeCalledTimes(i + 1)
      expect(mockQuery).toBeCalledWith('get', req.params)
    }
  })

  test('should call get and fail', async () => {
    const handler = HomeController({
      user: { projection: new UserProjection() }
    })
    const inputs = [null, undefined]
    for (let i = 0; i < inputs.length; i++) {
      const req = inputs[i]
      const task = handler.get(req)
      await expect(task).rejects.toThrowError(TypeError)
    }
    expect(mockQuery).toBeCalledTimes(0)
  })
})
