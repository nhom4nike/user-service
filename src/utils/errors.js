const codes = {
  req: {
    missing_param: 'req/missing-param',
    invalid_email: 'req/invalid-email',
    type_mismatch: 'req/type-mismatch',
    missing_header: 'req/missing-header',
    weak_password: 'req/weak-password'
  },
  user: {
    invalid_id: 'users/invalid-id',
    duplicate_username: 'users/duplicate-username',
    duplicate_email: 'users/duplicate-email',
    invalid_email: 'users/invalid-email',
    weak_password: 'users/weak-password',
    wrong_email: 'users/wrong-email',
    wrong_password: 'users/wrong_password'
  },
  auth: {
    token_missing: 'auths/missing-token',
    token_invalid: 'auths/invalid-token',
    token_expired: 'auths/expired-token'
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
    case codes.req.weak_password:
      return 'password is too weak'
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

  /** parse Error instance */
  parse: function (error) {
    const { message } = error

    // parse mongoose error
    if (error.name === 'CastError') {
      if (error.kind === 'ObjectId') {
        // invalid id error
        return {
          code: codes.user.invalid_id,
          message: map(codes.user.invalid_id),
          value: error.value
        }
      }
    } else if (error.name === 'MongoError') {
      // unique field error
      const groups = error.message.match(
        /duplicate.*\.(\w+).*index: (\w+)_\d{1,}.*{ \2: "(.+)" }/
      )
      if (groups) {
        const code = `${groups[1]}/duplicate-${groups[2]}`
        return {
          code,
          message: map(code),
          value: groups[3]
        }
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
