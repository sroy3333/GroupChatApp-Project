const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const authenticate = require('../middleware/auth');

router.post('/create', authenticate, groupController.createGroup);
router.get('/', authenticate, groupController.getGroups);
router.get('/:groupId', authenticate, groupController.getGroupDetails);

module.exports = router;