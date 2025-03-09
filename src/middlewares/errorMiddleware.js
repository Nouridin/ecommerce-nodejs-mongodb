const logger = require('../utils/logger');
const { error: formatError } = require('../utils/apiResponse');

/**
 * Custom error handler for the application
 * Logs the error and sends a formatted response to the client
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode: err.statusCode || 500,
    stack: err.stack,
  });

  // Set status code
  const statusCode = err.statusCode || 500;

  // Prepare error details
  const errorDetails = process.env.NODE_ENV === 'development' 
    ? { stack: err.stack, details: err.details || null } 
    : { details: err.details || null };

  // Send formatted error response
  res.status(statusCode).json(
    formatError(err.message || 'Something went wrong on the server', errorDetails)
  );
};

module.exports = { errorHandler }; 