const { query } = require('../config/database');

const User = {
  findById: async (id) => {
    const result = await query(
      `SELECT id, email, full_name, phone, avatar_url, is_verified, is_active,
              two_factor_enabled, kyc_status, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  findByEmail: async (email) => {
    const result = await query(
      `SELECT id, email, full_name, phone, password_hash, is_active,
              two_factor_enabled, two_factor_secret, kyc_status
       FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  },

  create: async ({ email, password_hash, full_name, phone }) => {
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, phone`,
      [email, password_hash, full_name, phone]
    );
    return result.rows[0];
  },

  update: async (id, fields) => {
    const keys = Object.keys(fields);
    if (!keys.length) return null;
    const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const values = Object.values(fields);
    const result = await query(
      `UPDATE users SET ${sets}, updated_at = NOW() WHERE id = $1
       RETURNING id, email, full_name, phone, two_factor_enabled, kyc_status`,
      [id, ...values]
    );
    return result.rows[0] || null;
  },

  setTwoFactorSecret: async (id, secret) => {
    await query(
      'UPDATE users SET two_factor_secret = $1, updated_at = NOW() WHERE id = $2',
      [secret, id]
    );
  },

  enableTwoFactor: async (id) => {
    await query(
      'UPDATE users SET two_factor_enabled = TRUE, updated_at = NOW() WHERE id = $1',
      [id]
    );
  },

  disableTwoFactor: async (id) => {
    await query(
      'UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL, updated_at = NOW() WHERE id = $1',
      [id]
    );
  },

  deactivate: async (id) => {
    await query(
      'UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1',
      [id]
    );
  },
};

module.exports = User;