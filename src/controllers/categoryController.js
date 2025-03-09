const asyncHandler = require('../utils/asyncHandler');
const Category = require('../models/categoryModel');

// Get all categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
});

// Get a single category by ID
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// Create a new category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, parent, image, level, displayOrder, featured, metaTitle, metaDescription } = req.body;

  const category = new Category({
    name,
    description,
    parent,
    image,
    level,
    displayOrder,
    featured,
    metaTitle,
    metaDescription,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// Update a category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, description, parent, image, level, displayOrder, featured, metaTitle, metaDescription } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;
    category.parent = parent || category.parent;
    category.image = image || category.image;
    category.level = level || category.level;
    category.displayOrder = displayOrder || category.displayOrder;
    category.featured = featured || category.featured;
    category.metaTitle = metaTitle || category.metaTitle;
    category.metaDescription = metaDescription || category.metaDescription;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// Delete a category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
}); 