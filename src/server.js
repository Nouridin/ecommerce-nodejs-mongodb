const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/errorMiddleware');
const { notFound } = require('./middlewares/notFoundMiddleware');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const {
  rateLimiter,
  authLimiter,
  securityHeaders,
  mongoSanitizeMiddleware,
  corsOptions,
  setSecurityHeaders,
  requestLogger
} = require('./middlewares/securityMiddleware');
const { compressionOptions, setCacheControl, staticOptions } = require('./config/express');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');

// Initialize express
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Security and utility middleware
app.use(securityHeaders); // Set security headers
app.use(morgan('combined')); // HTTP request logger
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(compression(compressionOptions)); // Compress responses with options
app.use(mongoSanitizeMiddleware); // Prevent MongoDB injection
app.use(setSecurityHeaders); // Set additional security headers
app.use(requestLogger); // Log requests in development mode
app.use(setCacheControl); // Apply cache control

// Apply rate limiting to all requests
app.use(rateLimiter);

// Apply stricter rate limiting to authentication routes
app.use('/api/auth', authLimiter);

// Set up Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/payments', paymentRoutes);

// Serve static files
app.use(express.static('public', staticOptions));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the E-Commerce API' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app; 