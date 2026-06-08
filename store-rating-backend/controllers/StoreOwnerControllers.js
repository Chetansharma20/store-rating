const storeService = require('../services/storeService');
const catchAsync = require('../utils/catchAsync');
const { ApiResponse } = require('../utils/apiResponse');

exports.getRatingsForMyStore = catchAsync(async (req, res, next) => {
  const owner_id = req.user?.id;
  const results = await storeService.getRatingsForMyStore(owner_id);
  res.json(new ApiResponse(200, results));
});

exports.getAllStoresWithRatings = catchAsync(async (req, res, next) => {
  const { name, address, email, search } = req.query;
  const stores = await storeService.getAllStoresWithRatingsFiltered({ name, address, email, search });
  res.json(new ApiResponse(200, stores));
});