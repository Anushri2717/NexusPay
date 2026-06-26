const { query } = require('../config/database');

const createFraudAlert = async (userId, transactionId, alertType, severity, description) => {
  try {
    await query(
      `INSERT INTO fraud_alerts (user_id, transaction_id, alert_type, severity, description)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, transactionId, alertType, severity, description]
    );
  } catch (err) {
    console.error('Failed to create fraud alert:', err.message);
  }
};

const resolveAlert = async (alertId) => {
  await query(
    `UPDATE fraud_alerts SET is_resolved = TRUE, resolved_at = NOW() WHERE id = $1`,
    [alertId]
  );
};

const getUnresolvedAlerts = async (userId) => {
  const result = await query(
    `SELECT fa.*, t.amount, t.reference_id, t.type as tx_type
     FROM fraud_alerts fa
     LEFT JOIN transactions t ON t.id = fa.transaction_id
     WHERE fa.user_id = $1 AND fa.is_resolved = FALSE
     ORDER BY fa.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const analyzePatternsForUser = async (walletId) => {
  const flags = [];

  // Check for rapid successive transactions
  const rapid = await query(
    `SELECT COUNT(*) as cnt FROM transactions
     WHERE sender_wallet_id = $1
       AND created_at > NOW() - INTERVAL '5 minutes'
       AND status != 'failed'`,
    [walletId]
  );
  if (parseInt(rapid.rows[0].cnt) >= 3) flags.push('rapid_fire_transactions');

  // Check for unusual amount spike vs average
  const avgResult = await query(
    `SELECT AVG(amount) as avg_amount FROM transactions
     WHERE sender_wallet_id = $1 AND status = 'completed'
     AND created_at > NOW() - INTERVAL '30 days'`,
    [walletId]
  );
  const avg = parseFloat(avgResult.rows[0].avg_amount || 0);

  const latestResult = await query(
    `SELECT amount FROM transactions
     WHERE sender_wallet_id = $1
     ORDER BY created_at DESC LIMIT 1`,
    [walletId]
  );
  if (latestResult.rows.length && avg > 0) {
    const latest = parseFloat(latestResult.rows[0].amount);
    if (latest > avg * 5) flags.push('amount_spike');
  }

  return flags;
};

module.exports = { createFraudAlert, resolveAlert, getUnresolvedAlerts, analyzePatternsForUser };