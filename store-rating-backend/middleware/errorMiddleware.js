const { ApiResponse } = require('../utils/apiResponse');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = [];

  // Handle Sequelize Unique Constraint Errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map(el => el.message).join('. ');
    errors = err.errors.map(el => el.message);
  }

  // Handle Sequelize Validation Errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(el => el.message).join('. ');
    errors = err.errors.map(el => el.message);
  }

  // Log unexpected errors for debugging
  if (statusCode === 500) {
    console.error('ERROR 💥:', err);
  }

  // Send structured ApiResponse for errors
  res.status(statusCode).json(new ApiResponse(statusCode, null, message, errors));
};
