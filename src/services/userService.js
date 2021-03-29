const bcrypt = require('bcrypt');
const User = require('../models/user');
const tokenService = require('./tokenService');
const DatabaseService = require('./databaseService');
const AuthenticationError = require('../errors/authentication');

const userDatabase = new DatabaseService('email', User);

const findUser = async (email) => userDatabase.findOne(email.toLowerCase());

exports.createUser = async (user) => {
  await userDatabase.create({
    ...user,
    email: user.email.toLowerCase(),
    password: await bcrypt.hash(user.password, Number.parseInt(process.env.SALT_ROUNDS, 10)),
  });
  return tokenService.createToken(user);
};

exports.loginUser = async (email, password) => {
  try {
    const user = await findUser(email);
    if (await bcrypt.compare(password, user.password)) {
      return tokenService.createToken(user);
    }
  } catch (e) {
    // all errors should be masked without giving any detail
  }
  throw new AuthenticationError();
};

exports.findUser = findUser;

exports.deleteUser = async (email) => userDatabase.deleteOne(email);
