const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get cart for the logged-in user
router.get('/', protect, getCart);

// Add item to cart
router.post('/add', protect, addToCart);

// Update cart item
router.put('/update/:itemId', protect, updateCartItem);

// Remove item from cart
router.delete('/remove/:itemId', protect, removeFromCart);

// Clear cart
router.delete('/clear', protect, clearCart);

// Apply coupon
router.post('/apply-coupon', protect, applyCoupon);

// Remove coupon
router.delete('/remove-coupon', protect, removeCoupon);

module.exports = router; 