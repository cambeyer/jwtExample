const AuthorizationError = require('../errors/authorization');

exports.loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  }
  next(new AuthorizationError('You must be logged in to perform this action'));
};

exports.matchesBody = (req, res, next) => {
  if (req.user
    && req.body.email
    && req.user.email === req.body.email.toLowerCase()) {
    next();
  }
  next(new AuthorizationError('Action cannot be performed on another user'));
};

exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.roles && req.user.roles.includes('Admin')) {
    next();
  }
  next(new AuthorizationError('Action requires administrative access'));
};
