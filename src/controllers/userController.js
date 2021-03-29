const userService = require('../services/userService');
const tokenService = require('../services/tokenService');

const getEmail = (req) => req.params.email || req.body.email || req.query.email;

exports.createUser = async (req, res) => {
  res.json(await userService.createUser(req.body));
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  res.json(await userService.loginUser(email, password));
};

exports.logoutUser = async (req, res) => {
  await tokenService.clearTokens(getEmail(req));
  res.sendStatus(200);
};

exports.deleteUser = async (req, res) => {
  const email = getEmail(req);
  await tokenService.clearTokens(email);
  await userService.deleteUser(email);
  res.sendStatus(200);
};

exports.getUser = async (req, res) => {
  const { password, ...user } = (await userService.findUser(getEmail(req))).toObject();
  res.json(user);
};
