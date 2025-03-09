const express = require('express');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Get a single category by ID
router.get('/:id', getCategoryById);

// Create a new category (admin only)
router.post('/', protect, authorize('admin'), createCategory);

// Update a category (admin only)
router.put('/:id', protect, authorize('admin'), updateCategory);

// Delete a category (admin only)
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router; 