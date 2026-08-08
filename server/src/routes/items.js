const express = require('express');
const router = express.Router();

const {
  getItems,
  getMyItems,
  getRecentItems,
  getItemStats,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/items/itemController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getItems);
router.get('/recent', getRecentItems);
router.get('/stats', getItemStats);

// Protected routes (MUST be defined before /:id parameter matching)
router.get('/my-items', protect, getMyItems);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

// Single item lookup parameter route
router.get('/:id', getItemById);

module.exports = router;
