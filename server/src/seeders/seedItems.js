const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/auth/User');
const Item = require('../models/items/Item');

const sampleItems = [
  {
    title: 'Lost iPhone 15 Pro Max (Titanium Blue)',
    description: 'Left on the subway train or platform at Central Station around 6:30 PM. Has a dark blue silicone case with a cardholder on the back containing a Metro Pass.',
    type: 'lost',
    category: 'Electronics',
    location: {
      address: 'Central Station Subway Platform',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    dateOccurred: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    rewardAmount: 250,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop'],
    isFeatured: true,
  },
  {
    title: 'Found French Bulldog (Male, Black & White)',
    description: 'Found wandering near Riverside Park without a collar. Very friendly, wearing a blue harness with no tag. Safe and being cared for.',
    type: 'found',
    category: 'Pets',
    location: {
      address: 'Riverside Park near 86th St',
      city: 'New York',
      state: 'NY',
      zipCode: '10024',
    },
    dateOccurred: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    rewardAmount: 0,
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop'],
    isFeatured: true,
  },
  {
    title: 'Lost Vintage Leather Wallet (Brown)',
    description: 'Contains driver license, 2 credit cards, and family photo. Lost near Coffee Bean on 5th Ave. Reward offered for safe return, no questions asked!',
    type: 'lost',
    category: 'Wallets & Purses',
    location: {
      address: '5th Ave & 42nd St',
      city: 'New York',
      state: 'NY',
      zipCode: '10018',
    },
    dateOccurred: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    rewardAmount: 100,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop'],
    isVIP: true,
  },
  {
    title: 'Found Gold Watch (Seiko Automatic)',
    description: 'Found on a bench outside City Library. Gold stainless steel band with dark blue dial. Contact with proof of ownership / serial number.',
    type: 'found',
    category: 'Jewelry & Watches',
    location: {
      address: 'Public Library Plaza',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60605',
    },
    dateOccurred: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    rewardAmount: 0,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop'],
  },
  {
    title: 'Lost Toyota Key Fob with Keychain',
    description: 'Set of 3 keys with a black Toyota smart fob and a leather Eiffel Tower keychain. Dropped somewhere along the park jogging path.',
    type: 'lost',
    category: 'Vehicles & Keys',
    location: {
      address: 'Lincoln Park Jogging Track',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60614',
    },
    dateOccurred: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    rewardAmount: 50,
    images: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop'],
  },
  {
    title: 'Found US Passport & US Travel Document',
    description: 'Found in a clear pouch on airport shuttle bus Terminal 2. Handed over to lost & found manager office or owner can message with name confirmation.',
    type: 'found',
    category: 'Documents & IDs',
    location: {
      address: 'LAX Terminal 2 Shuttle Stop',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90045',
    },
    dateOccurred: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    rewardAmount: 0,
    images: ['https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop'],
    isFeatured: true,
  },
  {
    title: 'Lost Designer Sunglasses (Ray-Ban Wayfarer)',
    description: 'Classic black polarized Ray-Ban sunglasses in a leather hard case. Left on a table at Sunnyside Cafe.',
    type: 'lost',
    category: 'Accessories',
    location: {
      address: 'Sunnyside Cafe, Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
    },
    dateOccurred: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    rewardAmount: 40,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop'],
  },
  {
    title: 'Found Black Herschel Backpack',
    description: 'Contains a spiral notebook, water bottle, and charging cables. Found on bench near Union Square.',
    type: 'found',
    category: 'Bags & Backpacks',
    location: {
      address: 'Union Square Park',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94108',
    },
    dateOccurred: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    rewardAmount: 0,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop'],
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas for Seeding');

    // Ensure a seed user exists
    let seedUser = await User.findOne({ email: 'demo_finder@lostfound.com' });
    if (!seedUser) {
      seedUser = await User.create({
        name: 'Demo Lost & Found Admin',
        email: 'demo_finder@lostfound.com',
        phone: '+18005550199',
        password: 'Password123!',
        role: 'admin',
        isVerified: true,
        trustScore: 98,
      });
      console.log('👤 Created demo seed user');
    }

    // Clear existing sample items
    await Item.deleteMany({});
    console.log('🧹 Cleared existing items');

    const itemsToInsert = sampleItems.map((item) => ({
      ...item,
      user: seedUser._id,
      contactName: seedUser.name,
      contactEmail: seedUser.email,
      contactPhone: seedUser.phone,
    }));

    await Item.insertMany(itemsToInsert);
    console.log(`🎉 Successfully seeded ${itemsToInsert.length} sample lost & found items!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
