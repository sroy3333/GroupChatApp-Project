const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');
const Message = require('../models/Message');

exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create({ name: req.body.name, createdBy: req.user.userid });

    // Mark the user as admin in GroupMember
    await GroupMember.create({ groupId: group.id, userId: req.user.userid, isAdmin: true });

    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    console.log('User ID:', req.user.userid);
    const groups = await GroupMember.findAll({
      where: { userId: req.user.userid },
      include: [{ model: Group, as: 'group' }]
    });
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
      const group = await Group.findOne({
          where: { id: req.params.groupId },
          include: [
              {
                  model: GroupMember,
                  as: 'members',
                  include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
              },
              { model: Message, as: 'messages' }
          ]
      });

      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      // Determine if the user is an admin in this group
      const isAdmin = group.members.find(member => member.userId === req.user.userid && member.isAdmin);

      // Add isAdmin flag to each member object in the response
      const membersWithAdminStatus = group.members.map(member => ({
          user: member.user,
          isAdmin: member.isAdmin || member.userId === group.createdBy // Mark the group creator as admin
      }));

      group.members = membersWithAdminStatus;

      res.status(200).json(group);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};