class UserAggregate {
  create({ id = '', email = '', verified = false, secret = '', hash = '' }) {
    this.id = id
    this.email = email
    this.verified = verified
    this.secret = secret
    this.hash = hash

    return this
  }
}

module.exports = {
  UserAggregate
}
