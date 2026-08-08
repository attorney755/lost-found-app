const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAdminStats,
  getUsersList,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getItemsList,
  toggleItemFeature,
  moderateItemStatus,
  deleteItem,
  getCategories,
  createCategory,
  deleteCategory,
  getSystemSettings,
  updateSystemSettings,
  getAuditLogs,
} = require('../controllers/admin/adminController');

// All admin routes require JWT protection AND role: 'admin'
router.use(protect);
router.use(authorize('admin'));

// 1. Stats & Analytics Overview
router.get('/stats', getAdminStats);

// 2. User Management
router.get('/users', getUsersList);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId/status', toggleUserStatus);
router.delete('/users/:userId', deleteUser);

// 3. Item Moderation
router.get('/items', getItemsList);
router.put('/items/:itemId/feature', toggleItemFeature);
router.put('/items/:itemId/status', moderateItemStatus);
router.delete('/items/:itemId', deleteItem);

// 4. Content & Categories Management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:categoryId', deleteCategory);

// 5. System Settings & Toggles
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

// 6. Activity & Audit Logs
router.get('/logs', getAuditLogs);

module.exports = router;
