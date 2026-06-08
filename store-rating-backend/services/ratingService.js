const Rating = require('../models/RatingSchema.js');
const User = require('../models/userSchema.js');
const Store = require('../models/StoreSchema.js');
const AppError = require('../utils/appError.js');

exports.submitRating = async ({ user_id, store_id, value }) => {
  if (!user_id || !store_id || value === undefined) {
    throw new AppError("user_id, store_id, and value are required.", 400);
  }

  // Check if store exists
  const store = await Store.findByPk(store_id);
  if (!store) {
    throw new AppError("Store not found.", 404);
  }

  const [rating, created] = await Rating.upsert(
    { user_id, store_id, value },
    { returning: true }
  );

  const updatedRating = await Rating.findOne({ where: { user_id, store_id } });

  // Calculate new average rating
  const avgResult = await Rating.findOne({
    where: { store_id },
    attributes: [
      [Rating.sequelize.fn('AVG', Rating.sequelize.col('value')), 'avg_rating']
    ]
  });
  const updatedAverageRating = parseFloat(avgResult?.get('avg_rating')) || 0;

  // Fetch all ratings for the store to return in updated state
  const ratings = await Rating.findAll({
    where: { store_id },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
  });

  return {
    rating: updatedRating,
    updatedAverageRating,
    ratings
  };
};

exports.getRatingsForStore = async (storeId) => {
  if (!storeId) {
    throw new AppError('storeId is required.', 400);
  }

  const ratings = await Rating.findAll({
    where: { store_id: storeId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
  });

  return ratings;
};

exports.getAverageRatingForStore = async (storeId) => {
  if (!storeId) {
    throw new AppError('storeId is required.', 400);
  }

  const result = await Rating.findOne({
    where: { store_id: storeId },
    attributes: [
      [Rating.sequelize.fn('AVG', Rating.sequelize.col('value')), 'avg_rating']
    ]
  });

  return parseFloat(result.get('avg_rating')) || 0;
};
