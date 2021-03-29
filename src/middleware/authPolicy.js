const AuthorizationError = require('../errors/authorization');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');

const matchesBody = (req) => {
  const emails = [req.body.email, req.params.email, req.query.email].filter((email) => email);
  return req.user && emails.length > 0
    && emails.every((email) => email.toLowerCase() === req.user.email);
};

const isAdmin = (req) => req.user && req.user.roles && req.user.roles.includes('Admin');

exports.loggedIn = (req, res, next) => {
  if (!req.user) {
    throw new AuthorizationError('You must be logged in to perform this action');
  }
  next();
};

exports.matchesBodyOrAdmin = (req, res, next) => {
  if (!matchesBody(req) && !isAdmin(req)) {
    throw new AuthorizationError('Action cannot be performed on another user');
  }
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (!isAdmin(req)) {
    throw new AuthorizationError('Action requires administrative access');
  }
  next();
};

exports.refreshUser = async (req, res, next) => {
  req.user = await userService.findUser(req.user.email);
  next();
};

exports.forceCheckToken = async (req, res, next) => {
  await tokenService.checkToken(req.user.email, req.user.tokenId);
  next();
};
