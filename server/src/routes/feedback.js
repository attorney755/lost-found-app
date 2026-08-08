const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

// Public route for home page testimonials
router.get('/public', feedbackController.getPublicTestimonials);

// Submit feedback when marking item resolved
router.post('/', protect, feedbackController.createFeedback);

// Admin feedback statistics & management
router.get('/admin', protect, authorize('admin'), feedbackController.getAdminFeedbackStats);
router.delete('/admin/:id', protect, authorize('admin'), feedbackController.deleteFeedback);

module.exports = router;
