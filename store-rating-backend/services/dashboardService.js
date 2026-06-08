const User = require('../models/userSchema.js');
const Store = require('../models/StoreSchema.js');
const Rating = require('../models/RatingSchema.js');

exports.getAdminDashboardMetrics = async () => {
  const [total_users, total_stores, total_ratings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count()
  ]);

  return { total_users, total_stores, total_ratings };
};
