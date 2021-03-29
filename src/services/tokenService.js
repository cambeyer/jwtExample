const jwt = require('jsonwebtoken');

const Token = require('../models/token');
const DatabaseService = require('./databaseService');
const AuthenticationError = require('../errors/authentication');

const tokenDatabase = new DatabaseService('email', Token);

exports.createToken = async (user) => {
  const now = Date.now();
  const validitySeconds = Number.parseInt(process.env.TOKEN_VALIDITY_SECONDS, 10);
  const refreshValiditySeconds = Number.parseInt(
    process.env.REFRESH_TOKEN_VALIDITY_SECONDS,
    10,
  );
  const { _id } = await tokenDatabase.create({
    email: user.email,
    expireAt: new Date(now + refreshValiditySeconds * 1000),
  });
  const iat = Math.floor(now / 1000);
  const token = jwt.sign({
    email: user.email, tokenId: _id, roles: user.roles, iat,
  }, process.env.TOKEN_SECRET, { expiresIn: `${validitySeconds}s` });
  const refreshToken = jwt.sign({
    email: user.email, tokenId: _id, iat,
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: `${refreshValiditySeconds}s` });
  return { token, refreshToken };
};

exports.checkToken = async (email, tokenId) => {
  if ((await tokenDatabase.findMany({ email, _id: tokenId })).length < 1) {
    throw new AuthenticationError();
  }
};

exports.clearTokens = async (email) => tokenDatabase.deleteMany({ email });
