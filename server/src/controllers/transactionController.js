const { query } = require('../config/database');

// GET /api/transactions
const getTransactions = async (req, res) => {
  const { page = 1, limit = 20, type, status, start_date, end_date } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const walletResult = await query('SELECT id FROM wallets WHERE user_id = $1', [req.user.id]);
  if (!walletResult.rows.length) return res.status(404).json({ error: 'Wallet not found' });
  const walletId = walletResult.rows[0].id;

  let conditions = ['(t.sender_wallet_id = $1 OR t.receiver_wallet_id = $1)'];
  const params = [walletId];
  let paramIdx = 2;

  if (type) {
    conditions.push(`t.type = $${paramIdx++}`);
    params.push(type);
  }
  if (status) {
    conditions.push(`t.status = $${paramIdx++}`);
    params.push(status);
  }
  if (start_date) {
    conditions.push(`t.created_at >= $${paramIdx++}`);
    params.push(start_date);
  }
  if (end_date) {
    conditions.push(`t.created_at <= $${paramIdx++}`);
    params.push(end_date);
  }

  const whereClause = conditions.join(' AND ');

  const countResult = await query(
    `SELECT COUNT(*) FROM transactions t WHERE ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  params.push(parseInt(limit), offset);
  const result = await query(
    `SELECT t.*,
       sw.wallet_address as sender_address,
       rw.wallet_address as receiver_address,
       su.full_name as sender_name,
       ru.full_name as receiver_name
     FROM transactions t
     LEFT JOIN wallets sw ON sw.id = t.sender_wallet_id
     LEFT JOIN wallets rw ON rw.id = t.receiver_wallet_id
     LEFT JOIN users su ON su.id = sw.user_id
     LEFT JOIN users ru ON ru.id = rw.user_id
     WHERE ${whereClause}
     ORDER BY t.created_at DESC
     LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    params
  );

  res.json({
    transactions: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
    wallet_id: walletId,
  });
};

// GET /api/transactions/:id
const getTransaction = async (req, res) => {
  const { id } = req.params;
  const walletResult = await query('SELECT id FROM wallets WHERE user_id = $1', [req.user.id]);
  const walletId = walletResult.rows[0].id;

  const result = await query(
    `SELECT t.*,
       sw.wallet_address as sender_address,
       rw.wallet_address as receiver_address,
       su.full_name as sender_name,
       ru.full_name as receiver_name
     FROM transactions t
     LEFT JOIN wallets sw ON sw.id = t.sender_wallet_id
     LEFT JOIN wallets rw ON rw.id = t.receiver_wallet_id
     LEFT JOIN users su ON su.id = sw.user_id
     LEFT JOIN users ru ON ru.id = rw.user_id
     WHERE t.id = $1 AND (t.sender_wallet_id = $2 OR t.receiver_wallet_id = $2)`,
    [id, walletId]
  );

  if (!result.rows.length) return res.status(404).json({ error: 'Transaction not found' });
  res.json({ transaction: result.rows[0] });
};

module.exports = { getTransactions, getTransaction };