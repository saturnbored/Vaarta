const express = require('express');
const { accessChat, createGroupChat, renameGroupChat, removeFromGroup, addToGroup, fetchChats } = require('../controllers/chatControllers');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.use(authMiddleware);

router.route('/').post(accessChat).get(fetchChats);
router.route('/group').post(createGroupChat);
router.route('/group/rename').put(renameGroupChat);
router.route('/group/remove').put(removeFromGroup);
router.route('/group/add').put(addToGroup);

module.exports = router;