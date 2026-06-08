const { DataTypes } = require('sequelize');
const sequelize = require('../Database.js');
const User = require('./userSchema.js');

const Store = sequelize.define('Store', {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,

  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
   
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
   
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
 
}, {
  tableName: 'stores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });

module.exports = Store;
