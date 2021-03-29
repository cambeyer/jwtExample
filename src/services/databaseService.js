const RecordNotFoundError = require('../errors/recordNotFound');
const ValidationError = require('../errors/validation');
const GenericDbError = require('../errors/genericDb');

module.exports = class DbService {
  constructor(identifier, model) {
    this.Model = model;
    this.identifier = identifier;
  }

  static async tryAction(action) {
    try {
      return await action();
    } catch (exception) {
      throw (
        exception.code === 11000
                || exception.stack.includes('ValidationError')
                || (exception.reason?.code === 'ERR_ASSERTION')
          ? new ValidationError(exception.message) : new GenericDbError()
      );
    }
  }

  async findMany(query) {
    return DbService.tryAction(() => this.Model.find(query).select('-_id -__v'));
  }

  async findOne(id) {
    const getResult = await DbService.tryAction(() => this.Model.findOne({
      [this.identifier]: id,
    }).select('-_id -__v'));
    if (getResult == null) {
      throw new RecordNotFoundError();
    }
    return getResult;
  }

  async create(record) {
    return DbService.tryAction(() => new this.Model(record).save());
  }

  async deleteMany(query) {
    if ((await DbService.tryAction(() => this.Model.deleteMany(query))).deletedCount === 0) {
      throw new RecordNotFoundError();
    }
  }

  async deleteOne(id) {
    if ((await DbService.tryAction(() => this.Model.deleteOne({
      [this.identifier]: id,
    }))).deletedCount === 0) {
      throw new RecordNotFoundError();
    }
  }

  async replaceOrCreate(id, record) {
    return DbService.tryAction(() => this.Model.findOneAndReplace({
      [this.identifier]: id,
    }, record, {
      upsert: true,
    }));
  }

  async update(id, record) {
    const patchResult = await DbService.tryAction(() => this.Model.findOneAndUpdate({
      [this.identifier]: id,
    }, record, {
      new: true,
    }).select('-_id -__v'));
    if (patchResult == null) {
      throw new RecordNotFoundError();
    }
    return patchResult;
  }
};
