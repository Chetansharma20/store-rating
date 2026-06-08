class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.isOperational = true; // Identifies operational errors vs programming bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
