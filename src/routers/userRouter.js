const router = require('@awaitjs/express').Router();

const userController = require('../controllers/userController');
const authPolicy = require('../middleware/authPolicy');

router.postAsync('/signup', userController.createUser);
router.postAsync('/login', userController.loginUser);
router.postAsync('/logout', authPolicy.matchesBodyOrAdmin, userController.logoutUser);

router.deleteAsync('/:email', authPolicy.matchesBodyOrAdmin, userController.deleteUser);

module.exports = router;
