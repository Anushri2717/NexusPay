const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { register, login, verify2FA, setup2FA, enable2FA, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('full_name').trim().notEmpty().withMessage('Full name required'),
], validate, register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, login);

router.post('/verify-2fa', authenticate, verify2FA);
router.post('/setup-2fa', authenticate, setup2FA);
router.post('/enable-2fa', authenticate, enable2FA);
router.get('/me', authenticate, getMe);

module.exports = router;