const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a given user ID
 * @param {string} userId
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_secret_key_lost_found',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'fallback_secret_key_lost_found'
  );
};

module.exports = {
  generateToken,
  verifyToken,
};
