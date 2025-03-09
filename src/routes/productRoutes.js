const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Create a new product (admin only)
router.post('/', protect, authorize('admin'), createProduct);

// Update a product (admin only)
router.put('/:id', protect, authorize('admin'), updateProduct);

// Delete a product (admin only)
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router; 