const { query } = require('../config/database');

const Wallet = {
  findByUserId: async (userId) => {
    const result = await query(
      `SELECT w.*, u.email, u.full_name
       FROM wallets w
       JOIN users u ON u.id = w.user_id
       WHERE w.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  },

  findByAddress: async (address) => {
    const result = await query(
      `SELECT w.*, u.email, u.full_name
       FROM wallets w
       JOIN users u ON u.id = w.user_id
       WHERE w.wallet_address = $1`,
      [address]
    );
    return result.rows[0] || null;
  },

  findById: async (id) => {
    const result = await query('SELECT * FROM wallets WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  create: async ({ userId, walletAddress, currency = 'USD' }) => {
    const result = await query(
      `INSERT INTO wallets (user_id, wallet_address, currency)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, walletAddress, currency]
    );
    return result.rows[0];
  },

  updateBalance: async (client, walletId, newBalance) => {
    const result = await client.query(
      `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [newBalance, walletId]
    );
    return result.rows[0];
  },

  freeze: async (userId) => {
    const result = await query(
      `UPDATE wallets SET is_frozen = TRUE, updated_at = NOW()
       WHERE user_id = $1 RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  unfreeze: async (userId) => {
    const result = await query(
      `UPDATE wallets SET is_frozen = FALSE, updated_at = NOW()
       WHERE user_id = $1 RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  updateLimits: async (userId, { daily_limit, monthly_limit }) => {
    const result = await query(
      `UPDATE wallets SET daily_limit = COALESCE($2, daily_limit),
                          monthly_limit = COALESCE($3, monthly_limit),
                          updated_at = NOW()
       WHERE user_id = $1 RETURNING *`,
      [userId, daily_limit, monthly_limit]
    );
    return result.rows[0];
  },

  getDailySpend: async (walletId) => {
    const result = await query(
      `SELECT COALESCE(SUM(amount + fee), 0) as daily_spend
       FROM transactions
       WHERE sender_wallet_id = $1
         AND status = 'completed'
         AND created_at >= date_trunc('day', NOW())`,
      [walletId]
    );
    return parseFloat(result.rows[0].daily_spend);
  },
};

module.exports = Wallet;