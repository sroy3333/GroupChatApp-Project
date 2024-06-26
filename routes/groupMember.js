const express = require('express');
const router = express.Router();
const groupMemberController = require('../controllers/groupMember');
const authenticate = require('../middleware/auth');

router.post('/invite', authenticate, groupMemberController.inviteMember);
router.post('/remove', authenticate, groupMemberController.removeMember);
router.post('/promote', authenticate, groupMemberController.promoteMember);

module.exports = router;
