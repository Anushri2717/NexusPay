const { query } = require('../config/database');

// GET /api/analytics/summary
const getSummary = async (req, res) => {
  const walletResult = await query('SELECT id FROM wallets WHERE user_id = $1', [req.user.id]);
  if (!walletResult.rows.length) return res.status(404).json({ error: 'Wallet not found' });
  const walletId = walletResult.rows[0].id;

  const [totalSent, totalReceived, monthSent, monthReceived, txCount] = await Promise.all([
    query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE sender_wallet_id = $1 AND status = 'completed'`, [walletId]),
    query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE receiver_wallet_id = $1 AND status = 'completed'`, [walletId]),
    query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE sender_wallet_id = $1 AND status = 'completed' AND created_at >= date_trunc('month', NOW())`, [walletId]),
    query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE receiver_wallet_id = $1 AND status = 'completed' AND created_at >= date_trunc('month', NOW())`, [walletId]),
    query(`SELECT COUNT(*) FROM transactions WHERE (sender_wallet_id = $1 OR receiver_wallet_id = $1) AND status = 'completed'`, [walletId]),
  ]);

  res.json({
    total_sent: parseFloat(totalSent.rows[0].total),
    total_received: parseFloat(totalReceived.rows[0].total),
    month_sent: parseFloat(monthSent.rows[0].total),
    month_received: parseFloat(monthReceived.rows[0].total),
    transaction_count: parseInt(txCount.rows[0].count),
  });
};

// GET /api/analytics/spending-trend
const getSpendingTrend = async (req, res) => {
  const { period = '30' } = req.query;
  const walletResult = await query('SELECT id FROM wallets WHERE user_id = $1', [req.user.id]);
  const walletId = walletResult.rows[0].id;

  const result = await query(
    `SELECT 
       DATE(created_at) as date,
       COALESCE(SUM(CASE WHEN sender_wallet_id = $1 THEN amount ELSE 0 END), 0) as sent,
       COALESCE(SUM(CASE WHEN receiver_wallet_id = $1 THEN amount ELSE 0 END), 0) as received,
       COUNT(*) as count
     FROM transactions
     WHERE (sender_wallet_id = $1 OR receiver_wallet_id = $1)
       AND status = 'completed'
       AND created_at >= NOW() - INTERVAL '${parseInt(period)} days'
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    [walletId]
  );

  res.json({ trend: result.rows });
};

// GET /api/analytics/category-breakdown
const getCategoryBreakdown = async (req, res) => {
  const walletResult = await query('SELECT id FROM wallets WHERE user_id = $1', [req.user.id]);
  const walletId = walletResult.rows[0].id;

  const result = await query(
    `SELECT 
       category,
       COUNT(*) as count,
       SUM(amount) as total,
       AVG(amount) as average
     FROM transactions
     WHERE sender_wallet_id = $1 AND status = 'completed'
       AND created_at >= NOW() - INTERVAL '30 days'
     GROUP BY category
     ORDER BY total DESC`,
    [walletId]
  );

  res.json({ categories: result.rows });
};

// GET /api/analytics/monthly-comparison
const getMonthlyComparison = async (req, res) => {
  const walletResult = await query('SELECT id FROM wallets WHERE user_id = $1', [req.user.id]);
  const walletId = walletResult.rows[0].id;

  const result = await query(
    `SELECT 
       TO_CHAR(date_trunc('month', created_at), 'Mon YYYY') as month,
       date_trunc('month', created_at) as month_date,
       COALESCE(SUM(CASE WHEN sender_wallet_id = $1 THEN amount ELSE 0 END), 0) as sent,
       COALESCE(SUM(CASE WHEN receiver_wallet_id = $1 THEN amount ELSE 0 END), 0) as received
     FROM transactions
     WHERE (sender_wallet_id = $1 OR receiver_wallet_id = $1)
       AND status = 'completed'
       AND created_at >= NOW() - INTERVAL '6 months'
     GROUP BY date_trunc('month', created_at)
     ORDER BY month_date ASC`,
    [walletId]
  );

  res.json({ monthly: result.rows });
};

module.exports = { getSummary, getSpendingTrend, getCategoryBreakdown, getMonthlyComparison };