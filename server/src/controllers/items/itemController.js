const Item = require('../../models/items/Item');

/**
 * @desc    Get all items with search, filter, and pagination
 * @route   GET /api/items
 * @access  Public
 */
const getItems = async (req, res) => {
  try {
    const {
      q,
      type,
      category,
      city,
      status = 'active',
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Type filter (lost or found)
    if (type && ['lost', 'found'].includes(type)) {
      query.type = type;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // City filter
    if (city && city.trim() !== '') {
      query['location.city'] = { $regex: city.trim(), $options: 'i' };
    }

    // Search query across title, description, and location
    if (q && q.trim() !== '') {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { 'location.address': searchRegex },
        { 'location.city': searchRegex },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Sorting options
    const sort = {};
    if (sortBy === 'reward') {
      sort.rewardAmount = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'dateOccurred') {
      sort.dateOccurred = order === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = order === 'asc' ? 1 : -1;
    }

    const items = await Item.find(query)
      .populate('user', 'name email phone profileImage trustScore')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      items,
    });
  } catch (error) {
    console.error('getItems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user's posted items
 * @route   GET /api/items/my-items
 * @access  Private
 */
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch my items',
      error: error.message,
    });
  }
};

/**
 * @desc    Get recent items for landing page
 * @route   GET /api/items/recent
 * @access  Public
 */
const getRecentItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const items = await Item.find({ status: 'active' })
      .populate('user', 'name email phone profileImage trustScore')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent items',
      error: error.message,
    });
  }
};

/**
 * @desc    Get overall items statistics (Active DB count for total listed, 43 baseline for items recovered)
 * @route   GET /api/items/stats
 * @access  Public
 */
const getItemStats = async (req, res) => {
  try {
    // Only count active items as total listed
    const totalListed = await Item.countDocuments({ status: 'active' });
    const dbFound = await Item.countDocuments({ status: { $in: ['claimed', 'resolved'] } });
    const activeLost = await Item.countDocuments({ type: 'lost', status: 'active' });
    const activeFound = await Item.countDocuments({ type: 'found', status: 'active' });

    // Use 43 as sample baseline for items recovered
    const totalFound = dbFound > 0 ? 43 + dbFound : 43;

    // Consistent 95.0% platform success rate
    const successRate = '95.0%';

    res.status(200).json({
      success: true,
      stats: {
        totalListed, // Real Active DB Document Count
        totalFound,  // 43 sample baseline + DB found count
        activeLost,
        activeFound,
        successRate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single item details
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'user',
      'name email phone profileImage trustScore totalItems'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Increment view count
    item.viewsCount += 1;
    await item.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item details',
      error: error.message,
    });
  }
};

/**
 * @desc    Create new item (lost/found)
 * @route   POST /api/items
 * @access  Private
 */
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      location,
      dateOccurred,
      images,
      videoUrl,
      rewardAmount,
      contactName,
      contactPhone,
      contactEmail,
    } = req.body;

    const item = await Item.create({
      title,
      description,
      type,
      category,
      location,
      dateOccurred: dateOccurred || Date.now(),
      images: images || [],
      videoUrl: videoUrl || null,
      rewardAmount: rewardAmount || 0,
      user: req.user.id,
      contactName: contactName || req.user.name,
      contactPhone: contactPhone || req.user.phone,
      contactEmail: contactEmail || req.user.email,
    });

    // Update user's totalItems count
    req.user.totalItems += 1;
    await req.user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    console.error('createItem error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create item',
      error: error.message,
    });
  }
};

/**
 * @desc    Update item
 * @route   PUT /api/items/:id
 * @access  Private
 */
const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check ownership or admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update item',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete item
 * @route   DELETE /api/items/:id
 * @access  Private
 */
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check ownership or admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message,
    });
  }
};

module.exports = {
  getItems,
  getMyItems,
  getRecentItems,
  getItemStats,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
