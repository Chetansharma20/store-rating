const storeService = require('../services/storeService');
const catchAsync = require('../utils/catchAsync');
const { ApiResponse } = require('../utils/apiResponse');

exports.createStore = catchAsync(async (req, res, next) => {
  const { name, email, address, owner_id } = req.body;
  const store = await storeService.createStore({ name, email, address, owner_id });
  res.status(201).json(new ApiResponse(201, store, 'Store created successfully'));
});

