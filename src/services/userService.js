const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const tokenService = require('./tokenService');
const DatabaseService = require('./databaseService');
const AuthenticationError = require('../errors/authentication');

const userDatabase = new DatabaseService('email', User);

exports.createUser = async (user) => {
  await new User({ ...user }).validate();
  await userDatabase.create({
    ...user,
    email: user.email.toLowerCase(),
    password: await bcrypt.hash(user.password, Number.parseInt(process.env.SALT_ROUNDS, 10)),
  });
};

exports.loginUser = async (email, password) => {
  try {
    const user = await userDatabase.findOne(email.toLowerCase());
    if (await bcrypt.compare(password, user.password)) {
      const now = Date.now();
      const validitySeconds = Number.parseInt(process.env.TOKEN_VALIDITY_SECONDS, 10);
      const guid = uuidv4();
      const token = jwt.sign({
        email, guid, roles: user.roles, iat: Math.floor(now / 1000),
      }, process.env.TOKEN_SECRET, { expiresIn: `${validitySeconds}s` });
      await tokenService.createToken({
        email,
        guid,
        expireAt: new Date(now + validitySeconds * 1000),
      });
      return { token };
    }
  } catch (e) {
    // all errors should be masked without giving any detail
  }
  throw new AuthenticationError();
};

exports.logoutUser = async (email) => tokenService.clearTokens(email);

exports.deleteUser = async (email) => userDatabase.deleteOne(email);
