const User = require('../models/userSchema.js');
const Store = require('../models/StoreSchema.js');
const Rating = require('../models/RatingSchema.js');

exports.adminDashboard = async (req, res) => {
  try {
    const total_users = await User.count();
    const total_stores = await Store.count();
    const total_ratings = await Rating.count();

    res.json({ total_users, total_stores, total_ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
