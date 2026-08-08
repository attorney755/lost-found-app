const User = require('../../models/auth/User');
const Item = require('../../models/items/Item');
const Category = require('../../models/admin/Category');
const SystemSetting = require('../../models/admin/SystemSetting');
const AdminLog = require('../../models/admin/AdminLog');

// Helper to log admin actions
const logAdminAction = async (admin, action, targetType, targetId, details, req) => {
  try {
    await AdminLog.create({
      adminId: admin._id,
      adminName: admin.name,
      action,
      targetType,
      targetId: targetId ? targetId.toString() : null,
      details,
      ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
    });
  } catch (err) {
    console.error('Error writing admin log:', err);
  }
};

// 1. Overview Statistics & Analytics
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalLost = await Item.countDocuments({ type: 'lost' });
    const totalFound = await Item.countDocuments({ type: 'found' });
    const totalResolved = await Item.countDocuments({ status: 'resolved' });
    const totalActive = await Item.countDocuments({ status: 'active' });
    const totalFeatured = await Item.countDocuments({ isFeatured: true });

    // Category breakdown
    const categoryStats = await Item.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Estimated revenue from active subscriptions
    const proUsers = await User.countDocuments({ 'subscription.plan': 'pro' });
    const vipUsers = await User.countDocuments({ 'subscription.plan': 'vip' });
    const estimatedRevenue = (proUsers * 9.99) + (vipUsers * 24.99);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalItems,
        totalLost,
        totalFound,
        totalResolved,
        totalActive,
        totalFeatured,
        estimatedRevenue: estimatedRevenue.toFixed(2),
        categoryStats,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching admin stats', error: err.message });
  }
};

// 2. User Management: List & Filter
exports.getUsersList = async (req, res) => {
  try {
    const { q, role, page = 1, limit = 20 } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      page: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching users list', error: err.message });
  }
};

// 3. Update User Role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role value' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logAdminAction(req.user, 'USER_ROLE_CHANGE', 'User', user._id, `Changed user ${user.email} role from ${oldRole} to ${role}`, req);

    res.json({ success: true, message: `User role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating user role', error: err.message });
  }
};

// 4. Toggle User Active Status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    await logAdminAction(req.user, 'USER_STATUS_TOGGLE', 'User', user._id, `Toggled user ${user.email} verified status to ${user.isVerified}`, req);

    res.json({ success: true, message: `User status updated to ${user.isVerified ? 'Active' : 'Deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error toggling user status', error: err.message });
  }
};

// 5. Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    await Item.deleteMany({ user: userId });

    await logAdminAction(req.user, 'USER_DELETE', 'User', userId, `Deleted user ${user.email} and associated items`, req);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting user', error: err.message });
  }
};

// 6. Item Moderation: List Items
exports.getItemsList = async (req, res) => {
  try {
    const { q, type, status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await Item.find(query).populate('user', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      items,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      page: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching admin items', error: err.message });
  }
};

// 7. Toggle Item Feature
exports.toggleItemFeature = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.isFeatured = !item.isFeatured;
    await item.save();

    await logAdminAction(req.user, 'ITEM_FEATURE_TOGGLE', 'Item', itemId, `Toggled feature flag for "${item.title}" to ${item.isFeatured}`, req);

    res.json({ success: true, message: `Item feature status updated to ${item.isFeatured}`, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error toggling item feature', error: err.message });
  }
};

// 8. Moderate Item Status (Approve / Reject / Resolve)
exports.moderateItemStatus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    if (!['active', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.status = status;
    await item.save();

    await logAdminAction(req.user, 'ITEM_MODERATE', 'Item', itemId, `Changed status of "${item.title}" to ${status}`, req);

    res.json({ success: true, message: `Item status updated to ${status}`, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error moderating item', error: err.message });
  }
};

// 9. Delete Item
exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await Item.findByIdAndDelete(itemId);

    await logAdminAction(req.user, 'ITEM_DELETE', 'Item', itemId, `Deleted item "${item.title}"`, req);

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting item', error: err.message });
  }
};

// 10. Content & Categories Management
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching categories', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = await Category.create({ name, icon: icon || 'Grid', color: color || 'blue' });
    await logAdminAction(req.user, 'CATEGORY_CREATE', 'Category', category._id, `Created new category "${name}"`, req);

    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error creating category', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await logAdminAction(req.user, 'CATEGORY_DELETE', 'Category', categoryId, `Deleted category "${category.name}"`, req);

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting category', error: err.message });
  }
};

// 11. System Settings & Toggles
exports.getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching settings', error: err.message });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    const { siteName, contactEmail, maintenanceMode, featureToggles } = req.body;
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = new SystemSetting();
    }

    if (siteName !== undefined) settings.siteName = siteName;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (featureToggles) settings.featureToggles = { ...settings.featureToggles, ...featureToggles };

    settings.updatedAt = Date.now();
    await settings.save();

    await logAdminAction(req.user, 'SETTINGS_UPDATE', 'Setting', settings._id, 'Updated system settings & feature toggles', req);

    res.json({ success: true, message: 'System settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating settings', error: err.message });
  }
};

// 12. Activity & Audit Logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await AdminLog.find().sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit));
    const total = await AdminLog.countDocuments();

    res.json({
      success: true,
      logs,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      page: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching audit logs', error: err.message });
  }
};
