const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Lost & Found Finder Platform',
  },
  contactEmail: {
    type: String,
    default: 'support@lostfoundapp.com',
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  featureToggles: {
    userRegistration: { type: Boolean, default: true },
    itemPosting: { type: Boolean, default: true },
    itemClaiming: { type: Boolean, default: true },
    messaging: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
  },
  securitySettings: {
    sessionTimeoutMinutes: { type: Number, default: 60 },
    requireEmailVerification: { type: Boolean, default: false },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
