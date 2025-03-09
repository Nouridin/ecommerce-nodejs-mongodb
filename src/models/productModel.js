const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'A product must have a description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (val) {
          // "this" refers to current document only on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP'],
    },
    sizes: [String],
    colors: [String],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: String,
        isMain: {
          type: Boolean,
          default: false,
        },
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'A product must belong to at least one category'],
      },
    ],
    brand: {
      type: String,
      required: [true, 'A product must have a brand'],
    },
    tags: [String],
    countInStock: {
      type: Number,
      required: [true, 'A product must have a count in stock'],
      min: [0, 'Count in stock must be a positive number'],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    SKU: {
      type: String,
      unique: true,
      required: [true, 'A product must have a SKU'],
      trim: true,
    },
    weight: {
      value: {
        type: Number,
        required: [true, 'A product must have a weight'],
      },
      unit: {
        type: String,
        enum: ['kg', 'g', 'lb', 'oz'],
        default: 'kg',
      },
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'in'],
        default: 'cm',
      },
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating must not exceed 5'],
        set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A product must belong to a seller'],
    },
    shippingInfo: {
      free: {
        type: Boolean,
        default: false,
      },
      fee: {
        type: Number,
        default: 0,
      },
      estimatedDelivery: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
productSchema.index({ name: 1, price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ isActive: 1, isOnSale: 1, featured: 1 });

// Virtual property for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Create slug from name before saving
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function () {
  return this.countInStock > 0;
};

// Method to calculate final price (with discount if applicable)
productSchema.methods.getFinalPrice = function () {
  return this.isOnSale && this.discountPrice
    ? this.discountPrice
    : this.price;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 