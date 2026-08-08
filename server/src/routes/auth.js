const express = require('express');
const router = express.Router();

const register = require('../controllers/auth/register');
const login = require('../controllers/auth/login');
const googleAuth = require('../controllers/auth/googleAuth');
const { getMe, updateDetails, forgotPassword, resetPassword } = require('../controllers/auth/password');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Auth Endpoints
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
