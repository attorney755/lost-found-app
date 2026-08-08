const User = require('../../models/auth/User');
const { generateToken } = require('../../utils/helpers');

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { identifier, email, phone, password } = req.body;
    const loginInput = (identifier || email || phone || '').trim();

    if (!loginInput || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone and password',
      });
    }

    // Query user by email or phone (case-insensitive email query)
    const user = await User.findOne({
      $or: [
        { email: loginInput.toLowerCase() },
        { phone: loginInput },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login timestamp
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate JWT Token
    const token = generateToken(user._id);

    // User payload without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      subscription: user.subscription,
      trustScore: user.trustScore,
      totalItems: user.totalItems,
      successfulClaims: user.successfulClaims,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

module.exports = login;
