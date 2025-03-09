const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

// Get all orders (admin only)
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'id firstName lastName email');
  res.json(orders);
});

// Get a single order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'id firstName lastName email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// Create a new order
exports.createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Clear user's cart after order is placed
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(createdOrder);
  }
});

// Update order status (admin only)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}); 