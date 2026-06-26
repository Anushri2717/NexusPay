const { query } = require('../config/database');

const Transaction = {
  findById: async (id) => {
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
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  findByWallet: async (walletId, { limit = 20, offset = 0, type, status, start_date, end_date } = {}) => {
    const conditions = ['(t.sender_wallet_id = $1 OR t.receiver_wallet_id = $1)'];
    const params = [walletId];
    let idx = 2;

    if (type)       { conditions.push(`t.type = $${idx++}`);            params.push(type); }
    if (status)     { conditions.push(`t.status = $${idx++}`);          params.push(status); }
    if (start_date) { conditions.push(`t.created_at >= $${idx++}`);     params.push(start_date); }
    if (end_date)   { conditions.push(`t.created_at <= $${idx++}`);     params.push(end_date); }

    const where = conditions.join(' AND ');

    const countRes = await query(`SELECT COUNT(*) FROM transactions t WHERE ${where}`, params);
    const total = parseInt(countRes.rows[0].count);

    params.push(limit, offset);
    const rows = await query(
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
       WHERE ${where}
       ORDER BY t.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      params
    );

    return { rows: rows.rows, total };
  },

  create: async (client, {
    sender_wallet_id, receiver_wallet_id, amount, fee = 0,
    currency = 'USD', type, status = 'pending', description,
    category = 'general', reference_id, fraud_score = 0,
    is_flagged = false, flag_reason = null, metadata = {},
  }) => {
    const result = await client.query(
      `INSERT INTO transactions
         (sender_wallet_id, receiver_wallet_id, amount, fee, currency, type, status,
          description, category, reference_id, fraud_score, is_flagged, flag_reason, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        sender_wallet_id, receiver_wallet_id, amount, fee, currency, type, status,
        description, category, reference_id, fraud_score, is_flagged, flag_reason,
        JSON.stringify(metadata),
      ]
    );
    return result.rows[0];
  },

  updateStatus: async (id, status) => {
    const result = await query(
      `UPDATE transactions SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  getFlaggedByUser: async (userId) => {
    const result = await query(
      `SELECT t.* FROM transactions t
       JOIN wallets w ON w.id = t.sender_wallet_id OR w.id = t.receiver_wallet_id
       WHERE w.user_id = $1 AND t.is_flagged = TRUE
       ORDER BY t.created_at DESC LIMIT 10`,
      [userId]
    );
    return result.rows;
  },
};

module.exports = Transaction;