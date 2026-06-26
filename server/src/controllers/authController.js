const { query } = require('../config/database');
const { hashPassword, comparePassword, generateWalletAddress } = require('../utils/encryption');
const { generateToken } = require('../utils/jwt');
const { generateSecret, verifyOTP, getOTPUri } = require('../services/otpService');
const { sendWelcomeEmail } = require('../services/emailService');
const QRCode = require('qrcode');

// POST /api/auth/register
const register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const password_hash = await hashPassword(password);

  const userResult = await query(
    `INSERT INTO users (email, password_hash, full_name, phone)
     VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, phone`,
    [email, password_hash, full_name, phone]
  );
  const user = userResult.rows[0];

  const walletAddress = generateWalletAddress();
  await query(
    'INSERT INTO wallets (user_id, wallet_address) VALUES ($1, $2)',
    [user.id, walletAddress]
  );

  const token = generateToken({ userId: user.id });

  try { await sendWelcomeEmail(email, full_name); } catch (_) {}

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: { id: user.id, email: user.email, full_name: user.full_name },
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await query(
    'SELECT id, email, full_name, password_hash, two_factor_enabled, is_active FROM users WHERE email = $1',
    [email]
  );
  if (!result.rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];
  if (!user.is_active) return res.status(403).json({ error: 'Account suspended' });

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  if (user.two_factor_enabled) {
    // Return partial token — client must verify 2FA
    const tempToken = generateToken({ userId: user.id, requires2FA: true }, '10m');
    return res.json({ requires2FA: true, tempToken });
  }

  const token = generateToken({ userId: user.id });
  res.json({
    token,
    user: { id: user.id, email: user.email, full_name: user.full_name, two_factor_enabled: user.two_factor_enabled },
  });
};

// POST /api/auth/verify-2fa
const verify2FA = async (req, res) => {
  const { token: otp } = req.body;
  const userId = req.user.id;

  const result = await query('SELECT two_factor_secret FROM users WHERE id = $1', [userId]);
  const { two_factor_secret } = result.rows[0];

  const valid = verifyOTP(otp, two_factor_secret);
  if (!valid) return res.status(400).json({ error: 'Invalid 2FA code' });

  const authToken = generateToken({ userId });
  res.json({ token: authToken, message: '2FA verified' });
};

// POST /api/auth/setup-2fa
const setup2FA = async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  const secret = generateSecret();
  const uri = getOTPUri(secret, userEmail);
  const qrCodeUrl = await QRCode.toDataURL(uri);

  await query('UPDATE users SET two_factor_secret = $1 WHERE id = $2', [secret, userId]);

  res.json({ qrCode: qrCodeUrl, secret });
};

// POST /api/auth/enable-2fa
const enable2FA = async (req, res) => {
  const { token: otp } = req.body;
  const userId = req.user.id;

  const result = await query('SELECT two_factor_secret FROM users WHERE id = $1', [userId]);
  const { two_factor_secret } = result.rows[0];

  if (!two_factor_secret) return res.status(400).json({ error: 'Setup 2FA first' });

  const valid = verifyOTP(otp, two_factor_secret);
  if (!valid) return res.status(400).json({ error: 'Invalid code' });

  await query('UPDATE users SET two_factor_enabled = TRUE WHERE id = $1', [userId]);
  res.json({ message: '2FA enabled successfully' });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const result = await query(
    `SELECT u.id, u.email, u.full_name, u.phone, u.two_factor_enabled, u.kyc_status,
            w.id as wallet_id, w.balance, w.currency, w.wallet_address, w.is_frozen, w.daily_limit
     FROM users u
     LEFT JOIN wallets w ON w.user_id = u.id
     WHERE u.id = $1`,
    [req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'User not found' });

  const row = result.rows[0];
  res.json({
    user: {
      id: row.id, email: row.email, full_name: row.full_name,
      phone: row.phone, two_factor_enabled: row.two_factor_enabled, kyc_status: row.kyc_status,
    },
    wallet: {
      id: row.wallet_id, balance: row.balance, currency: row.currency,
      wallet_address: row.wallet_address, is_frozen: row.is_frozen, daily_limit: row.daily_limit,
    },
  });
};

module.exports = { register, login, verify2FA, setup2FA, enable2FA, getMe };