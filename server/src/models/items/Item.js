const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Please specify whether the item is lost or found'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Electronics',
        'Wallets & Purses',
        'Pets',
        'Documents & IDs',
        'Jewelry & Watches',
        'Accessories',
        'Vehicles & Keys',
        'Bags & Backpacks',
        'Clothing',
        'Other',
      ],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please add a location or address'],
      },
      city: {
        type: String,
        required: [true, 'Please add a city'],
      },
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    dateOccurred: {
      type: Date,
      required: [true, 'Please specify the date when the item was lost or found'],
    },
    status: {
      type: String,
      enum: ['active', 'claimed', 'resolved', 'closed'],
      default: 'active',
    },
    images: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: null,
    },
    rewardAmount: {
      type: Number,
      default: 0,
      min: [0, 'Reward amount cannot be negative'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVIP: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for keyword search across title, description, category, and location city
itemSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  'location.city': 'text',
  'location.address': 'text',
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
