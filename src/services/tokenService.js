const Token = require('../models/token');
const DatabaseService = require('./databaseService');
const AuthenticationError = require('../errors/authentication');

const tokenDatabase = new DatabaseService('email', Token);

exports.createToken = async (token) => {
  await new Token({ ...token }).validate();
  return tokenDatabase.create(token);
};

exports.checkToken = async (email, guid) => {
  if ((await tokenDatabase.findMany({ email, guid })).length < 1) {
    throw new AuthenticationError();
  }
};

exports.clearTokens = async (email) => tokenDatabase.deleteMany({ email });
