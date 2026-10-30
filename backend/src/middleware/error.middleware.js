const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof SyntaxError && err.status === 400) {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  // PostgreSQL Level DB Validation
  if (err.code === '23505') {
    // Unique violation
    statusCode = 409;
    message = err.detail || "Duplicate record already exists";
  } else if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400;
    message = err.detail || "Referenced record does not exist or is currently in use";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  const response = {
    success: false,
    message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
