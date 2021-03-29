const tokenService = require('../services/tokenService');

exports.refreshToken = async (req, res) => {
  res.json(await tokenService.createToken(req.user));
};
