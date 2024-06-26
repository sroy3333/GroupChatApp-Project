const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const GroupMember = require('./GroupMember');

const Group = sequelize.define('Group', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

Group.associate = (models) => {
  Group.hasMany(models.GroupMember, {
    foreignKey: 'groupId',
    as: 'members'
  });

  Group.hasMany(models.Message, {
    foreignKey: 'groupId',
    as: 'messages'
  })
};

module.exports = Group;