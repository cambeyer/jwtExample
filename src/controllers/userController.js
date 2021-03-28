const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  res.json(await userService.createUser(req.body));
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  res.json(await userService.loginUser(email, password));
};

exports.logoutUser = async (req, res) => {
  await userService.logoutUser(req.body.email);
  res.sendStatus(200);
};

exports.deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.email);
  res.sendStatus(200);
};
