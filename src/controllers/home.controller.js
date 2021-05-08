module.exports = function handler({ user }) {
  return {
    create: async function (req) {
      const { aggregate } = user
      return aggregate.command('create', req.body)
    },
    get: async function (req) {
      const { projection } = user
      return projection.query('get', req.params)
    }
  }
}
