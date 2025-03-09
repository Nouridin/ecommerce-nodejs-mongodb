const asyncHandler = require('../utils/asyncHandler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Get cart for the logged-in user
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// Add item to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, color, size } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id });
  }

  await cart.addItem(product, quantity, color, size);
  res.json(cart);
});

// Update cart item
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity, color, size } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  await cart.updateQuantity(itemId, quantity, color, size);
  res.json(cart);
});

// Remove item from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  await cart.removeItem(itemId);
  res.json(cart);
});

// Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  await cart.clearCart();
  res.json(cart);
});

// Apply coupon
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode, discountAmount } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  await cart.applyCoupon(couponCode, discountAmount);
  res.json(cart);
});

// Remove coupon
exports.removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  await cart.removeCoupon();
  res.json(cart);
}); 