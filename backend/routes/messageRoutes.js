const express = require('express');
const { sendMessage, allMessages } = require('../controllers/messageControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/').post(sendMessage);
router.route('/:chatId').get(allMessages);

module.exports = router;