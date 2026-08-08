const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lostfound';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Ensure Admin User exists in Atlas
    const User = require('../models/auth/User');
    let adminUser = await User.findOne({ email: 'admin@lostfound.com' });
    if (!adminUser) {
      await User.create({
        name: 'System Super Admin',
        email: 'admin@lostfound.com',
        phone: '+18005559999',
        password: 'AdminPass123!',
        role: 'admin',
        isVerified: true,
        trustScore: 100,
        subscription: { plan: 'pro', isActive: true },
      });
      console.log('👑 Auto-created Admin user (admin@lostfound.com)');
    }
  } catch (error) {
    console.warn(`\n⚠️  Database Connection Warning: ${error.message}`);
    console.log(`💡 Attempting automatic local in-memory database fallback...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const fallbackUri = mongoServer.getUri();

      const conn = await mongoose.connect(fallbackUri);
      console.log(`✅ Fallback In-Memory MongoDB Connected: ${fallbackUri}`);

      // Seed users automatically for local fallback
      const User = require('../models/auth/User');
      const Item = require('../models/items/Item');
      
      let adminUser = await User.findOne({ email: 'admin@lostfound.com' });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'System Super Admin',
          email: 'admin@lostfound.com',
          phone: '+18005559999',
          password: 'AdminPass123!',
          role: 'admin',
          isVerified: true,
          trustScore: 100,
          subscription: { plan: 'pro', isActive: true },
        });
        console.log('👑 Auto-seeded Admin user into fallback database');
      }

      let seedUser = await User.findOne({ email: 'demo_finder@lostfound.com' });
      if (!seedUser) {
        seedUser = await User.create({
          name: 'Demo Lost & Found Finder',
          email: 'demo_finder@lostfound.com',
          phone: '+18005550199',
          password: 'Password123!',
          role: 'user',
          isVerified: true,
          trustScore: 98,
        });
      }

      const count = await Item.countDocuments();
      if (count === 0) {
        await Item.insertMany([
          {
            title: 'Lost iPhone 15 Pro Max (Titanium Blue)',
            description: 'Left on the subway platform at Central Station. Has a dark blue case with a Metro Pass.',
            type: 'lost',
            category: 'Electronics',
            location: { address: 'Central Station', city: 'New York', state: 'NY' },
            dateOccurred: new Date(),
            rewardAmount: 250,
            images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop'],
            user: seedUser._id,
            contactName: seedUser.name,
            contactPhone: seedUser.phone,
            contactEmail: seedUser.email,
            isFeatured: true,
          },
          {
            title: 'Found French Bulldog (Male, Black & White)',
            description: 'Found near Riverside Park without a collar. Friendly, wearing blue harness.',
            type: 'found',
            category: 'Pets',
            location: { address: 'Riverside Park', city: 'New York', state: 'NY' },
            dateOccurred: new Date(),
            rewardAmount: 0,
            images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop'],
            user: seedUser._id,
            contactName: seedUser.name,
            contactPhone: seedUser.phone,
            contactEmail: seedUser.email,
            isFeatured: true,
          },
          {
            title: 'Lost Vintage Leather Wallet (Brown)',
            description: 'Contains driver license & family photo. Lost near 5th Ave.',
            type: 'lost',
            category: 'Wallets & Purses',
            location: { address: '5th Ave', city: 'New York', state: 'NY' },
            dateOccurred: new Date(),
            rewardAmount: 100,
            images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop'],
            user: seedUser._id,
            contactName: seedUser.name,
            contactPhone: seedUser.phone,
            contactEmail: seedUser.email,
          }
        ]);
        console.log(`🎉 Auto-seeded sample items into fallback database!`);
      }
    } catch (fallbackError) {
      console.error(`❌ Connection Failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;