const compression = require('compression');

// Compression options for better performance
exports.compressionOptions = {
  level: 6, // 0-9, where 9 is best compression but slowest
  threshold: 100 * 1024, // Only compress responses > 100KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      // Don't compress responses with this request header
      return false;
    }
    // Compress all other responses
    return compression.filter(req, res);
  },
};

// Cache control middleware for different resource types
exports.setCacheControl = (req, res, next) => {
  // Static assets
  if (req.path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    return next();
  }

  // API responses
  if (req.path.startsWith('/api')) {
    // Set Cache-Control based on HTTP method
    if (req.method === 'GET') {
      // GET requests can be cached briefly
      res.setHeader('Cache-Control', 'private, max-age=60'); // 1 minute
    } else {
      // POST, PUT, DELETE should not be cached
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  } else {
    // Default for other routes
    res.setHeader('Cache-Control', 'no-store');
  }
  
  return next();
};

// Configure express-static options
exports.staticOptions = {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
    } else if (path.match(/\.(woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
    }
  },
}; 