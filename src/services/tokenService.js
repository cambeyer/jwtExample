const Token = require('../models/token');
const DatabaseService = require('./databaseService');
const AuthenticationError = require('../errors/authentication');

const tokenDatabase = new DatabaseService('email', Token);

exports.createToken = async (token) => {
  await new Token({ ...token }).validate();
  return tokenDatabase.create(token);
};

exports.checkToken = async (email, tokenId) => {
  if ((await tokenDatabase.findMany({ email, _id: tokenId })).length < 1) {
    throw new AuthenticationError();
  }
};

exports.clearTokens = async (email) => tokenDatabase.deleteMany({ email });
