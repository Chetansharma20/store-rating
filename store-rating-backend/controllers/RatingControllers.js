const ratingService = require('../services/ratingService');
const catchAsync = require('../utils/catchAsync');
const { ApiResponse } = require('../utils/apiResponse');

exports.createOrUpdateRating = catchAsync(async (req, res, next) => {
  const { user_id, store_id, value } = req.body;
  const result = await ratingService.submitRating({ user_id, store_id, value });
  res.json(new ApiResponse(200, result, 'Rating submitted successfully'));
});

exports.getRatingsForStore = catchAsync(async (req, res, next) => {
  const storeId = req.query.storeId;
  const ratings = await ratingService.getRatingsForStore(storeId);
  res.json(new ApiResponse(200, ratings));
});

exports.getAverageRatingForStore = catchAsync(async (req, res, next) => {
  const storeId = req.query.storeId;
  const average = await ratingService.getAverageRatingForStore(storeId);
  res.json(new ApiResponse(200, { average }));
});
