const userService = require('../services/userService');

const getEmail = (req) => req.params.email || req.body.email || req.query.email;

exports.createUser = async (req, res) => {
  await userService.createUser(req.body);
  res.sendStatus(200);
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  res.json(await userService.loginUser(email, password));
};

exports.logoutUser = async (req, res) => {
  await userService.logoutUser(getEmail(req));
  res.sendStatus(200);
};

exports.deleteUser = async (req, res) => {
  await userService.deleteUser(getEmail(req));
  res.sendStatus(200);
};

exports.getUser = async (req, res) => {
  const { password, ...user } = (await userService.findUser(getEmail(req))).toObject();
  res.json(user);
};
