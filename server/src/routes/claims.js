const express = require('express');
const router = express.Router();

const {
  createClaim,
  getMyClaimNotifications,
  markClaimRead,
  deleteClaim,
} = require('../controllers/claims/claimController');
const { protect } = require('../middleware/auth');

router.post('/', createClaim);
router.get('/my-notifications', protect, getMyClaimNotifications);
router.put('/:id/read', protect, markClaimRead);
router.delete('/:id', protect, deleteClaim);

module.exports = router;
