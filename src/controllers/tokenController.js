const userService = require('../services/userService');
const tokenService = require('../services/tokenService');

exports.refreshToken = async (req, res) => {
  const user = await userService.findUser(req.user.email);
  res.json(await tokenService.createToken(user));
};
