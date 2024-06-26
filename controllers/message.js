const Message = require('../models/Message');
const GroupMember = require('../models/GroupMember');

exports.sendMessage = async (req, res) => {
  try {
    const isMember = await GroupMember.findOne({
      where: { groupId: req.body.groupId, userId: req.user.userid }
    });

    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    const message = await Message.create({
      groupId: req.body.groupId,
      userId: req.user.userid,
      content: req.body.content
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const isMember = await GroupMember.findOne({
      where: { groupId: req.params.groupId, userId: req.user.userid }
    });

    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    const messages = await Message.findAll({ where: { groupId: req.params.groupId } });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};