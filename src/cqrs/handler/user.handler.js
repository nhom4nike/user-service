exports.UserCommandHandler = class {
  /**
   * @param {import('../repositories/user.repo')} repository
   */
  constructor(repository) {
    this.repository = repository
  }

  /**
   *
   * @param {import('../commands/user.command').RegisterCommand} command
   */
  async register(command) {}
}
