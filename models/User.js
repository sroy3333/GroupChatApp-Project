const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },

    phonenumber: {
        type: Sequelize.STRING,
        allowNull: false
    },

    password: Sequelize.STRING,
});

User.associate = (models) => {
    User.hasMany(models.GroupMember, {
      foreignKey: 'userId',
      as: 'groupMemberships'
    });
};
  
module.exports = User