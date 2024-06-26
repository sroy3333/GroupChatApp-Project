const  Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Message = sequelize.define('Message', {
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
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

Message.associate = (models) => {
  Message.belongsTo(models.Group, {
    foreignKey: 'groupId',
    as: 'group'
  });
  Message.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Message;