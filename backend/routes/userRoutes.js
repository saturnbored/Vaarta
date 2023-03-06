const express = require('express');

const {registerUser, authUser, allUsers} = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', registerUser);
router.get('/', authMiddleware, allUsers);
router.post('/login', authUser);

module.exports = router;