const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const { setCookie, clearCookie } = require('../utils/cookieHelper');
const { ApiResponse } = require('../utils/apiResponse');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, address, password, role } = req.body;
  const user = await userService.createUser({ name, email, address, password, role });
  res.status(201).json(new ApiResponse(201, user, 'User registered'));
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);
  setCookie(res, result.token);
  res.json(new ApiResponse(200, result, 'Login successful'));
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { name, email, address, role, search } = req.query;
  const results = await userService.getAllUsersFiltered({ name, email, address, role, search });
  res.json(new ApiResponse(200, results));
});




exports.updatePassword = catchAsync(async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;
  const result = await userService.updateUserPassword(userId, oldPassword, newPassword);
  res.json(new ApiResponse(200, result, 'Password updated successfully'));
});

exports.logout = (req, res) => {
  clearCookie(res);
  res.json(new ApiResponse(200, null, "Logged out successfully"));
};
