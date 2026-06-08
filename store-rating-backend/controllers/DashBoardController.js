const dashboardService = require('../services/dashboardService');
const catchAsync = require('../utils/catchAsync');
const { ApiResponse } = require('../utils/apiResponse');

exports.adminDashboard = catchAsync(async (req, res, next) => {
  const metrics = await dashboardService.getAdminDashboardMetrics();
  res.json(new ApiResponse(200, metrics));
});
