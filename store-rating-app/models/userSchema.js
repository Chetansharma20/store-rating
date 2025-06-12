const { DataTypes } = require('sequelize');
const sequelize = require('../Database.js');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
   
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
   
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
   
      
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'store_owner'),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
