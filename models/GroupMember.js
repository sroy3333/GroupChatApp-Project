const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./User');

const GroupMember = sequelize.define('GroupMember', {
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'id'
    }
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false // Default value false, indicating not an admin
  }
});

GroupMember.associate = (models) => {
  GroupMember.belongsTo(models.Group, {
    foreignKey: 'groupId',
    as: 'group'
  });
  GroupMember.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = GroupMember;
