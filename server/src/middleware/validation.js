/**
 * Validation middleware for authentication routes
 */

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  // Accepts standard international/national phone number formats (7-15 digits, allowing +, -, spaces, parens)
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phone).trim());
};

const validateRegister = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Name is required');
  }

  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!phone || !phone.trim()) {
    errors.push('Phone number is required');
  } else if (!validatePhone(phone)) {
    errors.push('Please enter a valid phone number');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { identifier, email, phone, password } = req.body;
  const loginInput = identifier || email || phone;
  const errors = [];

  if (!loginInput || !String(loginInput).trim()) {
    errors.push('Please provide email or phone number');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
