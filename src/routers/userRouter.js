const router = require('@awaitjs/express').Router();
const { wrap } = require('@awaitjs/express');

const userController = require('../controllers/userController');
const authPolicy = require('../middleware/authPolicy');

router.postAsync('/signup', authPolicy.adminsCreateAdmins, userController.createUser);
router.postAsync('/login', userController.loginUser);

router.postAsync('/logout', [
  wrap(authPolicy.loggedIn, false),
  wrap(authPolicy.matchesBodyOrAdmin, false),
], userController.logoutUser);

router.deleteAsync('/:email', [
  wrap(authPolicy.loggedIn, false),
  wrap(authPolicy.matchesBodyOrAdmin, false),
  wrap(authPolicy.forceCheckToken, false),
], userController.deleteUser);

router.getAsync('/:email', userController.getUser);

module.exports = router;
