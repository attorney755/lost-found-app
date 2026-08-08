const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g. "USER_ROLE_CHANGE", "ITEM_DELETE", "CLAIM_APPROVE", "SETTINGS_UPDATE"
  },
  targetType: {
    type: String, // e.g. "User", "Item", "Claim", "Category", "Setting"
  },
  targetId: {
    type: String,
  },
  details: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
