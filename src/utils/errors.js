const codes = {
  req: {
    missing_param: 'req/missing-param',
    invalid_email: 'req/invalid-email',
    type_mismatch: 'req/type-mismatch'
  },
  user: {
    invalid_id: 'user/invalid-id',
    invalid_email: 'user/invalid-email',
    weak_password: 'user/weak-password'
  }
}

/** map error code with a error message */
function map(code) {
  switch (code) {
    case codes.user.invalid_id:
      return 'id does not have valid format'
    case codes.user.weak_password:
      return 'password is too weak'
    case codes.user.invalid_email:
      return 'invalid email format'
    case codes.req.invalid_email:
      return 'invalid email format'
    case codes.req.missing_param:
      return 'missing required parameter'
    case codes.req.type_mismatch:
      return 'value has wrong type'
    default:
      return undefined
  }
}

module.exports = {
  codes,
  /** format error message for express-validator */
  format: function (errors) {
    return errors
      .formatWith((e) => ({
        code: e.msg,
        message: map(e.msg),
        parameter: e.param,
        value: e.value
      }))
      .array({ onlyFirstError: true })[0]
  },

  /** create error helper */
  create: function (scope, type, value) {
    return new Error(`${scope}/${type}:${value}`)
  },

  /** parse Error.prototype.message */
  parse: function (message = '') {
    // parse mongoose error
    const groups = message.match(/(ObjectId).+"(\w+)".+"(\w+)".+"(\w+)"/)
    if (groups) {
      const code = `${groups[4]}/invalid-id`
      return {
        code,
        message: map(code),
        value: groups[2]
      }
    }

    // parse defined error
    const [code, value] = message.split(':', 2)
    if (map(code)) return { code, value, message: map(code) }
    return {
      code: 'unknown',
      value: 'unknown',
      message: 'Internal Server Error'
    }
  },
  message: map
}
