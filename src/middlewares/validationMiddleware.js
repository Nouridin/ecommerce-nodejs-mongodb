const { check, validationResult } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }
  next();
};

// User registration validation
exports.validateRegisterUser = [
  check('firstName', 'First name is required').notEmpty().trim(),
  check('lastName', 'Last name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 8 or more characters')
    .isLength({ min: 8 }),
  handleValidationErrors,
];

// User login validation
exports.validateLoginUser = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  handleValidationErrors,
];

// User profile update validation
exports.validateUpdateUserProfile = [
  check('firstName').optional().notEmpty().trim(),
  check('lastName').optional().notEmpty().trim(),
  check('email').optional().isEmail().normalizeEmail(),
  check('phone').optional().isMobilePhone(),
  check('addresses').optional().isArray(),
  handleValidationErrors,
];

// Password update validation
exports.validateUpdatePassword = [
  check('currentPassword', 'Current password is required').notEmpty(),
  check('newPassword', 'New password must be at least 8 characters')
    .isLength({ min: 8 }),
  handleValidationErrors,
];

// Forgot password validation
exports.validateForgotPassword = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  handleValidationErrors,
];

// Reset password validation
exports.validateResetPassword = [
  check('password', 'Password must be at least 8 characters')
    .isLength({ min: 8 }),
  handleValidationErrors,
];

// Product validation
exports.validateProduct = [
  check('name', 'Product name is required').notEmpty().trim(),
  check('description', 'Description is required').notEmpty(),
  check('price', 'Price is required and must be positive')
    .isNumeric({ min: 0 }),
  check('brand', 'Brand is required').notEmpty().trim(),
  check('categories', 'Categories must be an array').isArray(),
  check('countInStock', 'Count in stock is required and must be positive')
    .isInt({ min: 0 }),
  check('SKU', 'SKU is required').notEmpty().trim(),
  handleValidationErrors,
];

// Category validation
exports.validateCategory = [
  check('name', 'Category name is required').notEmpty().trim(),
  check('description').optional().trim(),
  check('parent').optional().isMongoId(),
  check('level').optional().isInt({ min: 1 }),
  check('displayOrder').optional().isInt({ min: 0 }),
  check('featured').optional().isBoolean(),
  handleValidationErrors,
];

// Cart item validation
exports.validateCartItem = [
  check('productId', 'Product ID is required').isMongoId(),
  check('quantity', 'Quantity must be at least 1').isInt({ min: 1 }),
  check('color').optional().trim(),
  check('size').optional().trim(),
  handleValidationErrors,
];

// Order validation
exports.validateOrder = [
  check('orderItems', 'Order items are required').isArray().notEmpty(),
  check('orderItems.*.product', 'Product ID is required').isMongoId(),
  check('orderItems.*.quantity', 'Quantity must be at least 1').isInt({ min: 1 }),
  check('shippingAddress', 'Shipping address is required').notEmpty(),
  check('shippingAddress.addressLine1', 'Address line 1 is required').notEmpty(),
  check('shippingAddress.city', 'City is required').notEmpty(),
  check('shippingAddress.state', 'State is required').notEmpty(),
  check('shippingAddress.postalCode', 'Postal code is required').notEmpty(),
  check('shippingAddress.country', 'Country is required').notEmpty(),
  check('shippingAddress.phone', 'Phone is required').notEmpty(),
  check('paymentMethod', 'Payment method is required').notEmpty(),
  handleValidationErrors,
]; 