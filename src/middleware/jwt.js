const jwt = require('jsonwebtoken');
const tokenService = require('../services/tokenService');

const AuthenticationError = require('../errors/authentication');

const checkToken = async (req, token) => {
  if (req.path.includes('token')) {
    const user = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    await tokenService.checkToken(user.email, user.tokenId);
    return user;
  }
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      req.user = await checkToken(req, token);
      next();
    } catch (e) {
      next(new AuthenticationError());
    }
  } else {
    next();
  }
};
