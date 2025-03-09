const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity cannot be less than 1'],
          default: 1,
        },
        color: String,
        size: String,
        price: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
cartSchema.index({ user: 1 });
cartSchema.index({ isActive: 1 });

// Calculate totals before saving
cartSchema.pre('save', function (next) {
  // Calculate total items
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total amount
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Apply discount if coupon is applied
  if (this.discountAmount > 0) {
    this.totalAmount -= this.discountAmount;
  }

  // Update lastActive timestamp
  this.lastActive = Date.now();

  next();
});

// Method to add product to cart
cartSchema.methods.addItem = async function (product, quantity = 1, color, size) {
  // Check if product is already in cart
  const itemIndex = this.items.findIndex(
    (item) => 
      item.product.toString() === product._id.toString() && 
      item.color === color && 
      item.size === size
  );

  // If product exists, update quantity
  if (itemIndex > -1) {
    this.items[itemIndex].quantity += quantity;
  } else {
    // Add new product to cart
    this.items.push({
      product: product._id,
      quantity,
      color,
      size,
      price: product.isOnSale && product.discountPrice
        ? product.discountPrice
        : product.price,
    });
  }

  // Save cart
  await this.save();
  return this;
};

// Method to remove product from cart
cartSchema.methods.removeItem = async function (productId, color, size) {
  // Remove the product from items array
  this.items = this.items.filter(
    (item) =>
      !(item.product.toString() === productId.toString() &&
      item.color === color &&
      item.size === size)
  );

  // Save cart
  await this.save();
  return this;
};

// Method to update quantity
cartSchema.methods.updateQuantity = async function (productId, quantity, color, size) {
  // Find the product in cart
  const itemIndex = this.items.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.color === color &&
      item.size === size
  );

  // If product found, update quantity
  if (itemIndex > -1) {
    this.items[itemIndex].quantity = quantity;
  }

  // Save cart
  await this.save();
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.totalAmount = 0;
  this.totalItems = 0;
  this.couponCode = null;
  this.discountAmount = 0;

  // Save cart
  await this.save();
  return this;
};

// Method to apply coupon
cartSchema.methods.applyCoupon = async function (couponCode, discountAmount) {
  this.couponCode = couponCode;
  this.discountAmount = discountAmount;

  // Save cart
  await this.save();
  return this;
};

// Method to remove coupon
cartSchema.methods.removeCoupon = async function () {
  this.couponCode = null;
  this.discountAmount = 0;

  // Save cart
  await this.save();
  return this;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 