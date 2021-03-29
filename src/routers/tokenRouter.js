const router = require('@awaitjs/express').Router();

const tokenController = require('../controllers/tokenController');
const authPolicy = require('../middleware/authPolicy');

router.getAsync('/refresh', authPolicy.refreshUser, tokenController.refreshToken);

module.exports = router;
