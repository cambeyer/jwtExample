module.exports = class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};
