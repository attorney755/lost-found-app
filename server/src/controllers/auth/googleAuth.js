const User = require('../../models/auth/User');
const { generateToken } = require('../../utils/helpers');

/**
 * Helper to decode base64 JWT payload from Google GIS Credential token
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * @desc    Authenticate or register user via Google Single Sign-On (SSO)
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleAuth = async (req, res) => {
  try {
    const { credential, email: bodyEmail, name: bodyName, picture: bodyPicture, googleId: bodyGoogleId } = req.body;

    let email = bodyEmail;
    let name = bodyName;
    let profileImage = bodyPicture || null;
    let googleId = bodyGoogleId;

    // Decode Google GIS credential token if provided
    if (credential) {
      const decoded = parseJwt(credential);
      if (decoded && decoded.email) {
        email = decoded.email;
        name = decoded.name || decoded.given_name || 'Google User';
        profileImage = decoded.picture || null;
        googleId = decoded.sub || decoded.aud;
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Could not verify Google authentication details. Please try again.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Derive clean user name if not provided
    if (!name || name === 'Google User') {
      name = cleanEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    }

    // Check if user already exists by email or googleId
    let user = await User.findOne({
      $or: [{ email: cleanEmail }, { googleId: googleId }],
    });

    if (user) {
      // Update existing user with Google details if provided
      if (!user.googleId && googleId) user.googleId = googleId;
      if (profileImage) user.profileImage = profileImage;
      user.isVerified = true;
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
    } else {
      // Register new user via Google with empty phone number
      user = await User.create({
        name: name,
        email: cleanEmail,
        phone: '',
        googleId: googleId || `google_${Date.now()}`,
        authProvider: 'google',
        profileImage: profileImage || null,
        isVerified: true,
        trustScore: 100,
        role: 'user',
        lastLogin: Date.now(),
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      profileImage: user.profileImage || null,
      avatarFrame: user.avatarFrame || 'sleek',
      isVerified: user.isVerified,
      subscription: user.subscription,
      trustScore: user.trustScore || 100,
      totalItems: user.totalItems || 0,
      successfulClaims: user.successfulClaims || 0,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.status(200).json({
      success: true,
      message: 'Successfully authenticated with Google!',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
      error: error.message,
    });
  }
};

module.exports = googleAuth;
