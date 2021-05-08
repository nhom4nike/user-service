module.exports = function handler({ user }) {
  return {
    get: async function (req) {
      const { aggregate } = user
      return aggregate.command('create', req.body)
    },
    create: async function (req) {
      const { projection } = user
      return projection.query('get', req.params)
    }
  }
}
