const Claim = require('../../models/claims/Claim');
const Item = require('../../models/items/Item');

/**
 * @desc    Submit a found/lost report notification to item poster
 * @route   POST /api/claims
 * @access  Public / Authenticated
 */
const createClaim = async (req, res) => {
  try {
    const { itemId, finderName, finderEmail, finderPhone, foundLocation, message } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Associated item not found',
      });
    }

    const claim = await Claim.create({
      item: item._id,
      poster: item.user,
      itemTitle: item.title,
      finderName,
      finderEmail,
      finderPhone,
      foundLocation,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Notification delivered to poster successfully!',
      claim,
    });
  } catch (error) {
    console.error('createClaim error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to submit report notification',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's received notifications
 * @route   GET /api/claims/my-notifications
 * @access  Private
 */
const getMyClaimNotifications = async (req, res) => {
  try {
    const notifications = await Claim.find({ poster: req.user.id })
      .populate('item', 'title type images status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/claims/:id/read
 * @access  Private
 */
const markClaimRead = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    claim.isRead = true;
    await claim.save();

    res.status(200).json({
      success: true,
      claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification status',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/claims/:id
 * @access  Private
 */
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    await claim.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

module.exports = {
  createClaim,
  getMyClaimNotifications,
  markClaimRead,
  deleteClaim,
};
