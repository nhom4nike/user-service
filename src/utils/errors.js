const codes = {
  req: {
    missing_param: 'req/missing-param',
    invalid_email: 'req/invalid-email',
    type_mismatch: 'req/type-mismatch'
  },
  user: {
    invalid_id: 'user/invalid-id',
    duplicate_username: 'user/duplicate-username',
    duplicate_email: 'user/duplicate-email',
    invalid_email: 'user/invalid-email',
    weak_password: 'user/weak-password',
    wrong_email: 'user/wrong-email',
    wrong_password: 'user/wrong_password'
  },
  auth: {
    token_missing: 'token/missing',
    token_invalid: 'token/invalid',
    token_expired: 'token/expired'
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
    case codes.user.duplicate_username:
      return 'username already in use'
    case codes.user.duplicate_email:
      return 'email already in use'
    case codes.user.wrong_email:
      return 'email does not exits on system'
    case codes.user.wrong_password:
      return 'password is not correct'
    case codes.req.invalid_email:
      return 'invalid email format'
    case codes.req.missing_param:
      return 'missing required parameter'
    case codes.req.type_mismatch:
      return 'value has wrong type'
    case codes.auth.token_missing:
      return 'missing header token'
    case codes.auth.token_invalid:
      return 'token is invalid please try again'
    case codes.auth.token_expired:
      return 'token is expired please refresh token'

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
  create: function (code, value) {
    return new Error(`${code}:${value}`)
  },

  /** parse Error.prototype.message */
  parse: function (error) {
    const { message } = error

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

    // unhandled error
    console.error(error)
    return {
      message: 'Internal Server Error'
    }
  },
  message: map
}
