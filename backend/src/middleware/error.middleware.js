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

  // PostgreSQL errors
  if (err.code === "23505") {
    statusCode = 409;
    message = "This record already exists. Please check your details.";
  }

  if (err.code === "23503") {
    statusCode = 400;
    message = "Related record does not exist or is currently in use.";
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
