const jwt = require('jsonwebtoken');
const tokenService = require('../services/tokenService');

const AuthenticationError = require('../errors/authentication');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const user = await jwt.verify(token, process.env.TOKEN_SECRET);
      await tokenService.checkToken(user.email, user.guid);
      req.user = user;
    } catch (e) {
      next(new AuthenticationError());
    }
  }
  next();
};
