const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { success, pagination } = require('../utils/apiResponse');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(success('User profile retrieved successfully', {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  } else {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // Only update addresses if provided
    if (req.body.addresses) {
      user.addresses = req.body.addresses;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      addresses: updatedUser.addresses,
      role: updatedUser.role,
      isEmailVerified: updatedUser.isEmailVerified,
    });
  } else {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
});

// @desc    Update user password
// @route   PUT /api/users/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Check if the required fields are provided
  if (!currentPassword || !newPassword) {
    const error = new Error('Please provide both current and new password');
    error.statusCode = 400;
    throw error;
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check if current password matches
  if (!(await user.matchPassword(currentPassword))) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

// @desc    Request password reset (forgot password)
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  // Get user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const error = new Error('No user found with that email');
    error.statusCode = 404;
    throw error;
  }

  // Generate reset token
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // TODO: Send email with reset URL
  logger.info(`Password reset URL: ${resetUrl}`);

  res.status(200).json({
    message: 'Password reset email sent',
  });
});

// @desc    Reset user password with token
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // Find user with the reset token and check if token is still valid
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});

// @desc    Verify user email with token
// @route   GET /api/users/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user with the verification token and check if token is still valid
  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error('Invalid or expired verification token');
    error.statusCode = 400;
    throw error;
  }

  // Set user as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Email verification successful' });
});

// --- ADMIN CONTROLLERS ---

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getUsers = asyncHandler(async (req, res) => {
  // Get pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Get total count for pagination info
  const total = await User.countDocuments();

  // Get users with pagination
  const users = await User.find()
    .select('-password')
    .limit(limit)
    .skip(startIndex)
    .sort({ createdAt: -1 });

  // Send response with pagination
  res.json(success(
    'Users retrieved successfully', 
    users, 
    pagination(total, page, limit)
  ));
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } else {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
}); 