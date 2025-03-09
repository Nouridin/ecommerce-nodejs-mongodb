/**
 * Standard API response format
 * @param {Boolean} success - Indicates if the request was successful
 * @param {String} message - Response message
 * @param {Object} data - Response data payload
 * @param {Object} meta - Metadata such as pagination
 * @returns {Object} Standardized response object
 */
const formatResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Success response
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @param {Object} meta - Metadata
 * @returns {Object} Success response
 */
exports.success = (message, data = null, meta = null) => {
  return formatResponse(true, message, data, meta);
};

/**
 * Error response
 * @param {String} message - Error message
 * @param {Object} errors - Error details
 * @returns {Object} Error response
 */
exports.error = (message, errors = null) => {
  return formatResponse(false, message, null, errors ? { errors } : null);
};

/**
 * Pagination metadata
 * @param {Number} total - Total items
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
exports.pagination = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  };
}; 