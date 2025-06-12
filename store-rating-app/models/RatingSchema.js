const { DataTypes } = require('sequelize');
const sequelize = require('../Database.js');
const User = require('./userSchema.js');
const Store = require('./StoreSchema.js');

const Rating = sequelize.define('Rating', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'stores', key: 'id' },
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Rating must be at least 1.',
      },
      max: {
        args: [5],
        msg: 'Rating must be at most 5.',
      },
    },
  },
}, {
  tableName: 'ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [{ unique: true, fields: ['user_id', 'store_id'], name: 'unique_rating' }],
});

Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });

module.exports = Rating;
