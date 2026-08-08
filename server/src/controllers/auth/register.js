const User = require('../../models/auth/User');
const { generateToken } = require('../../utils/helpers');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Normalize email & phone
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    // Check if user already exists with email or phone
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }
      if (existingUser.phone === normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: 'An account with this phone number already exists',
        });
      }
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
    });

    // Generate JWT Token
    const token = generateToken(user._id);

    // Prepare user payload without password
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
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

module.exports = register;
