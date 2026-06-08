

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Database.js'); 


const User = require('./userSchema')(sequelize, DataTypes);
const Store = require('./StoreSchema')(sequelize, DataTypes);
const Rating = require('./RatingSchema')(sequelize, DataTypes);


User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });

Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });


module.exports = {
  sequelize,
  User,
  Store,
  Rating
};
