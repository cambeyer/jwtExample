const router = require('@awaitjs/express').Router();
const { wrap } = require('@awaitjs/express');

const tokenController = require('../controllers/tokenController');
const authPolicy = require('../middleware/authPolicy');

router.getAsync('/refresh', [
  wrap(authPolicy.loggedIn, false),
  wrap(authPolicy.refreshUser, false),
], tokenController.refreshToken);

module.exports = router;
