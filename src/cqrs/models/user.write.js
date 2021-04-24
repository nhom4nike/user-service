/** payload for user registration command */
class UserRegistration {
  constructor(email = '', password = '', verfied = false) {
    this.email = email
    this.password = password
    this.verfied = verfied
  }
}

module.exports = {
  UserRegistration
}
