module.exports = class RecordNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};
