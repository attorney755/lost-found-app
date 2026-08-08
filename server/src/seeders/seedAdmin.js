const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/auth/User');
const Category = require('../models/admin/Category');
const SystemSetting = require('../models/admin/SystemSetting');

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lostfound';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to Database for Admin Initialization');

    // 1. Seed Admin User
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
      console.log('👑 Admin user (admin@lostfound.com / AdminPass123!) created successfully!');
    } else {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('👑 Existing admin user role verified: admin@lostfound.com');
    }

    // 2. Seed Default Categories
    const defaultCategories = [
      { name: 'Electronics', icon: 'Smartphone', color: 'blue' },
      { name: 'Wallets & Purses', icon: 'Wallet', color: 'amber' },
      { name: 'Pets', icon: 'Dog', color: 'rose' },
      { name: 'Documents & IDs', icon: 'FileText', color: 'cyan' },
      { name: 'Jewelry & Watches', icon: 'Watch', color: 'yellow' },
      { name: 'Accessories', icon: 'Glasses', color: 'purple' },
      { name: 'Vehicles & Keys', icon: 'Key', color: 'emerald' },
      { name: 'Bags & Backpacks', icon: 'ShoppingBag', color: 'fuchsia' },
      { name: 'Clothing', icon: 'Shirt', color: 'sky' },
      { name: 'Other', icon: 'Grid', color: 'slate' },
    ];

    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        { ...cat },
        { upsert: true, new: true }
      );
    }
    console.log('🏷️  Default Categories initialized!');

    // 3. Seed Default System Settings
    const existingSettings = await SystemSetting.findOne();
    if (!existingSettings) {
      await SystemSetting.create({});
      console.log('⚙️ Default System Settings initialized!');
    }

    console.log('🎉 Admin initialization completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Admin initialization error:', err);
    process.exit(1);
  }
}

seedAdmin();
