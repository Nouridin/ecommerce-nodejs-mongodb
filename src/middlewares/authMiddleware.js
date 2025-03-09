const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Middleware to protect routes that require authentication
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in the authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    // Get token from cookie
    token = req.cookies.jwt;
  }

  // If no token is found
  if (!token) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    throw error;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by id
    const user = await User.findById(decoded.id).select('-password');

    // If user not found
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    // If user is inactive
    if (!user.isActive) {
      const error = new Error('User account is deactivated');
      error.statusCode = 401;
      throw error;
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token, please log in again';
      error.statusCode = 401;
    } else if (error.name === 'TokenExpiredError') {
      error.message = 'Your token has expired, please log in again';
      error.statusCode = 401;
    }
    next(error);
  }
});

/**
 * Middleware to restrict access to specific roles
 * @param  {...string} roles - List of allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('User not authenticated');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `Role (${req.user.role}) is not authorized to access this resource`
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

module.exports = { protect, authorize }; 