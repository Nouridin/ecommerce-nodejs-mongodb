const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        color: String,
        size: String,
      },
    ],
    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'stripe'],
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountAmount: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP'],
    },
    couponCode: String,
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded',
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
    trackingNumber: String,
    shippingProvider: String,
    notes: String,
    invoiceNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'paymentResult.id': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ isPaid: 1, isDelivered: 1 });

// Pre-save hook to generate invoice number
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.models.Order.countDocuments();
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.invoiceNumber = `INV-${year}${month}-${(count + 1)
      .toString()
      .padStart(6, '0')}`;
  }
  next();
});

// Middleware to update product stock after order is placed
orderSchema.post('save', async function () {
  // Only update stock for new orders
  if (this.isNew) {
    try {
      const Product = mongoose.model('Product');
      
      // Update stock count for each product in the order
      for (const item of this.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.qty, sold: +item.qty },
        });
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  }
});

// Method to calculate total
orderSchema.methods.calculateTotals = function () {
  // Calculate subtotal
  this.subtotal = this.orderItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  
  // Apply discount if coupon is applied
  const discountedTotal = this.subtotal - this.discountAmount;
  
  // Calculate final total with tax and shipping
  this.totalPrice = discountedTotal + this.taxPrice + this.shippingPrice;
  
  return this.totalPrice;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 