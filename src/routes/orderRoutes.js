const express = require('express');
const { getOrders, getOrderById, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all orders (admin only)
router.get('/', protect, authorize('admin'), getOrders);

// Get a single order by ID
router.get('/:id', protect, getOrderById);

// Create a new order
router.post('/', protect, createOrder);

// Update order status (admin only)
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router; 