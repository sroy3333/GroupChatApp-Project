const GroupMember = require('../models/GroupMember');
const User = require('../models/User');
const Group = require('../models/Group');
const bcrypt = require('bcrypt');

exports.inviteMember = async (req, res) => {
    try {
        const { groupId, email } = req.body;
        let user = await User.findOne({ where: { email } });

        // If user does not exist, create a new user
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8); // Generate a random password
            const hashedPassword = await bcrypt.hash(randomPassword, 10); // Hash the random password
            const randomPhoneNumber = +10000000000;
            user = await User.create({ email, password: hashedPassword, name: email, phonenumber: randomPhoneNumber }); // Use email as a placeholder for the name
        }

        // Add the user to the group
        const member = await GroupMember.create({ groupId, userId: user.id, isAdmin: false });

        // Fetch the user details to include in the response
        const userDetails = await User.findOne({ where: { id: user.id }, attributes: ['id', 'name', 'email'] });

        res.status(201).json({ member, userDetails });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.removeMember = async (req, res) => {
    try {
      const { groupId, userId } = req.body;
  
      // Check if the user making the request is an admin or the one who created the group
      const group = await Group.findOne({ where: { id: groupId } });
  
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      if (req.user.userid !== group.createdBy) {
        return res.status(403).json({ error: 'Only the group creator can remove members' });
      }
  
      // Remove the member from the group
      await GroupMember.destroy({ where: { groupId, userId } });
  
      res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};


exports.promoteMember = async (req, res) => {
    try {
        const { groupId, memberId } = req.body;

        // Check if the requester is an admin of the group
        const isRequesterAdmin = await GroupMember.findOne({
            where: { groupId: groupId, userId: req.user.userid, isAdmin: true }
        });

        if (!isRequesterAdmin) {
            return res.status(403).json({ error: 'Only group admins can promote members' });
        }

        // Update the member to set isAdmin to true
        await GroupMember.update(
            { isAdmin: true },
            { where: { groupId: groupId, userId: memberId } }
        );

        // Fetch the updated member details to include in the response
        const updatedMember = await GroupMember.findOne({
            where: { groupId: groupId, userId: memberId },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        });

        res.status(200).json({ message: 'Member promoted to admin successfully', member: updatedMember });
    } catch (error) {
        console.error('Error promoting member:', error);
        res.status(400).json({ error: error.message });
    }
};