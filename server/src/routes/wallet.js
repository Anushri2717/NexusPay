const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { fraudDetection } = require('../middleware/fraudDetection');
const { getWallet, deposit, sendMoney, freezeWallet, unfreezeWallet, getFraudAlerts } = require('../controllers/walletController');
const { query } = require('../config/database');

// Middleware to attach walletId to request
const attachWallet = async (req, res, next) => {
  const result = await query('SELECT id FROM wallets WHERE user_id = $1', [req.user.id]);
  if (result.rows.length) req.walletId = result.rows[0].id;
  next();
};

router.get('/', authenticate, getWallet);
router.post('/deposit', authenticate, deposit);
router.post('/send', authenticate, attachWallet, fraudDetection, sendMoney);
router.post('/freeze', authenticate, freezeWallet);
router.post('/unfreeze', authenticate, unfreezeWallet);
router.get('/fraud-alerts', authenticate, getFraudAlerts);

module.exports = router;