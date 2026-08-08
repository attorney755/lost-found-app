const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    finderName: {
      type: String,
      required: [true, 'Finder name is required'],
      trim: true,
    },
    finderEmail: {
      type: String,
      required: [true, 'Finder email is required'],
      trim: true,
      lowercase: true,
    },
    finderPhone: {
      type: String,
      required: [true, 'Finder phone number is required'],
      trim: true,
    },
    foundLocation: {
      type: String,
      required: [true, 'Found location is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message description is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Claim', claimSchema);
