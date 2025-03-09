const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/productModel');

// Get all products
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.json(products);
});

// Get a single product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// Create a new product
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, brand, categories, countInStock, SKU, seller } = req.body;

  const product = new Product({
    name,
    description,
    price,
    brand,
    categories,
    countInStock,
    SKU,
    seller,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Update a product
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, brand, categories, countInStock, SKU, seller } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.brand = brand || product.brand;
    product.categories = categories || product.categories;
    product.countInStock = countInStock || product.countInStock;
    product.SKU = SKU || product.SKU;
    product.seller = seller || product.seller;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// Delete a product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}); 