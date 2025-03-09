# E-Commerce API

A secure and feature-rich Node.js backend for e-commerce applications. This project provides a complete API solution for building online stores with robust security and extensive functionality.

## Features

- **User Management**
  - Registration with email verification
  - Authentication with JWT
  - Password reset functionality
  - User profiles and addresses

- **Product Management**
  - CRUD operations for products
  - Product categories and filtering
  - Product search and pagination
  - Product reviews and ratings

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Apply discounts and coupons

- **Order Processing**
  - Create and manage orders
  - Multiple payment methods
  - Order history and tracking
  - Email notifications

- **Admin Dashboard**
  - User management
  - Product and inventory management
  - Order management
  - Sales analytics

- **Security**
  - JWT authentication
  - Role-based access control
  - Input validation and sanitization
  - Rate limiting
  - XSS and CSRF protection
  - MongoDB injection prevention

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=7d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

## Usage

### Development

Start the development server:
```bash
npm run dev
```

### Production

Start the production server:
```bash
npm start
```

### Testing

Run tests:
```bash
npm test
```

## API Endpoints

The API documentation is available at `/api-docs` when the server is running.

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/update-password` - Update password
- `POST /api/users/forgot-password` - Request password reset
- `PUT /api/users/reset-password/:resetToken` - Reset password
- `GET /api/users/verify-email/:token` - Verify email

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID
- `POST /api/categories` - Create a category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/apply-coupon` - Apply coupon
- `DELETE /api/cart/remove-coupon` - Remove coupon

### Orders

- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get an order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Security Measures

This API implements several security best practices:

1. **JWT Authentication**: Secure token-based authentication.
2. **Password Hashing**: Passwords are hashed using bcrypt.
3. **Input Validation**: All inputs are validated using express-validator.
4. **Sanitization**: Protection against MongoDB injection.
5. **Rate Limiting**: Prevention of brute-force and DoS attacks.
6. **Helmet**: Sets various HTTP headers for security.
7. **XSS Protection**: Sanitization of user inputs to prevent XSS attacks.
8. **CORS**: Configured to restrict access to specified origins.

## License

This project is licensed under the ISC License.

## Author

Your Name

## Acknowledgements

- Express.js
- MongoDB
- Mongoose
- JWT
- And all the other packages that made this possible 