const { query } = require('../config/database');

const VELOCITY_WINDOW = parseInt(process.env.FRAUD_VELOCITY_WINDOW_MINUTES || 10);
const MAX_TRANSACTIONS = parseInt(process.env.FRAUD_MAX_TRANSACTIONS || 5);
const HIGH_AMOUNT = parseFloat(process.env.FRAUD_HIGH_AMOUNT_THRESHOLD || 10000);

const calculateFraudScore = async (walletId, amount, receiverWalletId) => {
  let score = 0;
  const flags = [];

  // 1. Velocity check — too many transactions in short window
  const velocityResult = await query(
    `SELECT COUNT(*) as count FROM transactions
     WHERE sender_wallet_id = $1
     AND created_at > NOW() - INTERVAL '${VELOCITY_WINDOW} minutes'
     AND status != 'failed'`,
    [walletId]
  );
  const txCount = parseInt(velocityResult.rows[0].count);
  if (txCount >= MAX_TRANSACTIONS) {
    score += 0.4;
    flags.push('velocity_exceeded');
  }

  // 2. High amount check
  if (parseFloat(amount) >= HIGH_AMOUNT) {
    score += 0.3;
    flags.push('high_amount');
  }

  // 3. New receiver check — first time sending to this address
  if (receiverWalletId) {
    const newReceiverResult = await query(
      `SELECT COUNT(*) as count FROM transactions
       WHERE sender_wallet_id = $1 AND receiver_wallet_id = $2 AND status = 'completed'`,
      [walletId, receiverWalletId]
    );
    if (parseInt(newReceiverResult.rows[0].count) === 0) {
      score += 0.1;
      flags.push('new_receiver');
    }
  }

  // 4. Unusual hour (midnight to 4am UTC)
  const hour = new Date().getUTCHours();
  if (hour >= 0 && hour <= 4) {
    score += 0.1;
    flags.push('unusual_hour');
  }

  return { score: Math.min(score, 1.0), flags };
};

const fraudDetection = async (req, res, next) => {
  try {
    const { amount, receiver_wallet_address } = req.body;
    const { walletId } = req;

    if (!walletId || !amount) return next();

    let receiverWalletId = null;
    if (receiver_wallet_address) {
      const rw = await query('SELECT id FROM wallets WHERE wallet_address = $1', [receiver_wallet_address]);
      if (rw.rows.length) receiverWalletId = rw.rows[0].id;
    }

    const { score, flags } = await calculateFraudScore(walletId, amount, receiverWalletId);

    req.fraudScore = score;
    req.fraudFlags = flags;
    req.isFraudFlagged = score >= 0.6;

    next();
  } catch (err) {
    // Don't block transaction on fraud check failure
    req.fraudScore = 0;
    req.fraudFlags = [];
    req.isFraudFlagged = false;
    next();
  }
};

module.exports = { fraudDetection, calculateFraudScore };