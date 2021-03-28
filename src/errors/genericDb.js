module.exports = class GenericDbError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};
