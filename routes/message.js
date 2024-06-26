const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message');
const authenticate = require('../middleware/auth');

router.post('/send', authenticate, messageController.sendMessage);
router.get('/:groupId', authenticate, messageController.getMessages);

module.exports = router;