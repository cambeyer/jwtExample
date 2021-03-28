const router = require('@awaitjs/express').Router();

const userController = require('../controllers/userController');
const authPolicy = require('../utilities/authPolicy');

router.postAsync('/signup', userController.createUser);
router.postAsync('/login', userController.loginUser);
router.postAsync('/logout', authPolicy.matchesBody, userController.logoutUser);

router.deleteAsync('/:email', authPolicy.requireAdmin, userController.deleteUser);

module.exports = router;
