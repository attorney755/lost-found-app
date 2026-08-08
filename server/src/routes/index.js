const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const itemRoutes = require('./items');
const claimRoutes = require('./claims');
const adminRoutes = require('./admin');
const feedbackRoutes = require('./feedback');

// Mount routes
router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/claims', claimRoutes);
router.use('/admin', adminRoutes);
router.use('/feedback', feedbackRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Lost & Found API is healthy and running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
