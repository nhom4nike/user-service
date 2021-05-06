module.exports = {
  /** format error message for express-validator */
  format: function (errors) {
    return errors
      .foramtWith((e) => ({
        message: e.msg,
        parameter: e.param
      }))
      .array({ onlyFirstError: true })[0]
  },

  /** create error helper */
  create: function (scope, type, source) {
    return new Error(`${scope}/${type}:${source}`)
  },

  /** parse Error.prototype.message */
  parse: function (message = '') {
    if (message.match(/Cast to ObjectId/g)) {
      return {
        code: 'user/invalid-id',
        source: message
      }
    }
    const [code, source] = message.split(':', 2)
    return { code, source }
  }
}
