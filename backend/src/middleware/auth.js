// Authentication middleware will be added here

// Implement JWT authentication middleware
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');

// Secret key should be stored in environment variable in production.
// Fallback to a hard-coded string for local development so that the server can start even
// if the variable is missing.
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

/**
 * Authentication middleware.
 *
 * Expects an `Authorization` header in the form `Bearer <token>`.
 * If a valid token is provided, the decoded user payload is attached to `req.user`
 * and the request is allowed to continue. Otherwise, a 401 response is returned.
 */
module.exports = async function auth(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // `decoded` should contain the user id under `id` (set during sign-in).
    // We attach both the decoded token and the DB user document (if found) for convenience.
    req.user = decoded;

    // Optionally fetch the customer record for further checks/roles.
    if (decoded.id) {
      try {
        const customer = await Customer.findById(decoded.id).select('-password');
        if (customer) {
          req.customer = customer; // alias for convenience
        }
      } catch (dbErr) {
        // If DB lookup fails, we still allow the request to proceed with decoded info.
        console.error('Auth middleware: failed to fetch customer:', dbErr);
      }
    }

    return next();
  } catch (err) {
    console.error('Auth middleware: token verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
