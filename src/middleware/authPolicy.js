const AuthorizationError = require('../errors/authorization');
const userService = require('../services/userService');

const matchesBody = (req) => {
  const emails = [req.body.email, req.params.email, req.query.email].filter((email) => email);
  return req.user && emails.length > 0
    && emails.every((email) => email.toLowerCase() === req.user.email);
};

const isAdmin = (req) => req.user && req.user.roles && req.user.roles.includes('Admin');

exports.loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  }
  next(new AuthorizationError('You must be logged in to perform this action'));
};

exports.matchesBodyOrAdmin = (req, res, next) => {
  if (matchesBody(req) || isAdmin(req)) {
    next();
  }
  next(new AuthorizationError('Action cannot be performed on another user'));
};

exports.requireAdmin = (req, res, next) => {
  if (isAdmin(req)) {
    next();
  }
  next(new AuthorizationError('Action requires administrative access'));
};

exports.refreshUser = async (req, res, next) => {
  req.user = await userService.findUser(req.user.email);
  next();
};
