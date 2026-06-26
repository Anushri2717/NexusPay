-- Migration 002: Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(18, 2) DEFAULT 0.00 NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  is_frozen BOOLEAN DEFAULT FALSE,
  daily_limit DECIMAL(18, 2) DEFAULT 5000.00,
  monthly_limit DECIMAL(18, 2) DEFAULT 50000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(wallet_address);

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();