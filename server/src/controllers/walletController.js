const { query, getClient } = require('../config/database');
const { generateReferenceId } = require('../utils/encryption');
const { sendTransactionAlert, sendFraudAlert } = require('../services/emailService');

// GET /api/wallet
const getWallet = async (req, res) => {
  const result = await query(
    'SELECT * FROM wallets WHERE user_id = $1',
    [req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Wallet not found' });
  res.json({ wallet: result.rows[0] });
};

// POST /api/wallet/deposit
const deposit = async (req, res) => {
  const { amount } = req.body;
  if (!amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const walletResult = await client.query(
      'SELECT id, balance FROM wallets WHERE user_id = $1 FOR UPDATE',
      [req.user.id]
    );
    const wallet = walletResult.rows[0];

    const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
    await client.query('UPDATE wallets SET balance = $1 WHERE id = $2', [newBalance, wallet.id]);

    const refId = generateReferenceId();
    const txResult = await client.query(
      `INSERT INTO transactions (receiver_wallet_id, amount, type, status, description, reference_id)
       VALUES ($1, $2, 'deposit', 'completed', $3, $4) RETURNING *`,
      [wallet.id, amount, `Deposit of $${amount}`, refId]
    );

    await client.query('COMMIT');

    try { await sendTransactionAlert(req.user.email, txResult.rows[0]); } catch (_) {}

    res.json({
      message: 'Deposit successful',
      transaction: txResult.rows[0],
      new_balance: newBalance,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// POST /api/wallet/send
const sendMoney = async (req, res) => {
  const { receiver_wallet_address, amount, description } = req.body;

  if (!amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Get sender wallet
    const senderResult = await client.query(
      'SELECT w.id, w.balance, w.is_frozen FROM wallets w WHERE w.user_id = $1 FOR UPDATE',
      [req.user.id]
    );
    const sender = senderResult.rows[0];

    if (sender.is_frozen) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Your wallet is frozen. Contact support.' });
    }

    if (parseFloat(sender.balance) < parseFloat(amount)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Get receiver wallet
    const receiverResult = await client.query(
      'SELECT w.id, w.balance, u.email as receiver_email FROM wallets w JOIN users u ON u.id = w.user_id WHERE w.wallet_address = $1 FOR UPDATE',
      [receiver_wallet_address]
    );
    if (!receiverResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Recipient wallet not found' });
    }
    const receiver = receiverResult.rows[0];

    if (receiver.id === sender.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot send to yourself' });
    }

    const fee = parseFloat(amount) > 1000 ? parseFloat(amount) * 0.001 : 0; // 0.1% fee over $1000
    const totalDeducted = parseFloat(amount) + fee;

    // Deduct from sender
    await client.query('UPDATE wallets SET balance = balance - $1 WHERE id = $2', [totalDeducted, sender.id]);
    // Add to receiver
    await client.query('UPDATE wallets SET balance = balance + $1 WHERE id = $2', [amount, receiver.id]);

    const refId = generateReferenceId();
    const isFlagged = req.isFraudFlagged || false;
    const fraudScore = req.fraudScore || 0;
    const status = isFlagged ? 'flagged' : 'completed';

    const txResult = await client.query(
      `INSERT INTO transactions 
       (sender_wallet_id, receiver_wallet_id, amount, fee, type, status, description, reference_id, fraud_score, is_flagged, flag_reason, metadata)
       VALUES ($1, $2, $3, $4, 'send', $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        sender.id, receiver.id, amount, fee, status,
        description || `Payment to ${receiver_wallet_address}`,
        refId, fraudScore, isFlagged,
        isFlagged ? req.fraudFlags.join(', ') : null,
        JSON.stringify({ flags: req.fraudFlags || [] })
      ]
    );

    // Create fraud alert if flagged
    if (isFlagged) {
      await client.query(
        `INSERT INTO fraud_alerts (user_id, transaction_id, alert_type, severity, description)
         VALUES ($1, $2, 'transaction_flagged', $3, $4)`,
        [
          req.user.id, txResult.rows[0].id,
          fraudScore >= 0.8 ? 'critical' : 'high',
          `Transaction flagged: ${req.fraudFlags.join(', ')}`
        ]
      );
    }

    await client.query('COMMIT');

    try { await sendTransactionAlert(req.user.email, txResult.rows[0]); } catch (_) {}
    if (isFlagged) {
      try {
        await sendFraudAlert(req.user.email, {
          description: `A suspicious transaction of $${amount} was flagged: ${req.fraudFlags.join(', ')}`
        });
      } catch (_) {}
    }

    res.json({
      message: status === 'flagged' ? 'Transaction flagged for review' : 'Payment sent successfully',
      transaction: txResult.rows[0],
      is_flagged: isFlagged,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// POST /api/wallet/freeze
const freezeWallet = async (req, res) => {
  await query('UPDATE wallets SET is_frozen = TRUE WHERE user_id = $1', [req.user.id]);
  res.json({ message: 'Wallet frozen successfully' });
};

// POST /api/wallet/unfreeze
const unfreezeWallet = async (req, res) => {
  await query('UPDATE wallets SET is_frozen = FALSE WHERE user_id = $1', [req.user.id]);
  res.json({ message: 'Wallet unfrozen' });
};

// GET /api/wallet/fraud-alerts
const getFraudAlerts = async (req, res) => {
  const result = await query(
    `SELECT fa.*, t.amount, t.reference_id FROM fraud_alerts fa
     LEFT JOIN transactions t ON t.id = fa.transaction_id
     WHERE fa.user_id = $1 ORDER BY fa.created_at DESC LIMIT 20`,
    [req.user.id]
  );
  res.json({ alerts: result.rows });
};

module.exports = { getWallet, deposit, sendMoney, freezeWallet, unfreezeWallet, getFraudAlerts };