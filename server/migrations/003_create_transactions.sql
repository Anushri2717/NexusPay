-- Migration 003: Create transactions table
CREATE TYPE transaction_type AS ENUM ('send', 'receive', 'deposit', 'withdrawal', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'flagged', 'reversed');

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_wallet_id UUID REFERENCES wallets(id),
  receiver_wallet_id UUID REFERENCES wallets(id),
  amount DECIMAL(18, 2) NOT NULL,
  fee DECIMAL(18, 2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  reference_id VARCHAR(255) UNIQUE,
  metadata JSONB DEFAULT '{}',
  fraud_score DECIMAL(5, 4) DEFAULT 0.0000,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender_wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON transactions(receiver_wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_flagged ON transactions(is_flagged) WHERE is_flagged = TRUE;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fraud alerts table
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  transaction_id UUID REFERENCES transactions(id),
  alert_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user_id ON fraud_alerts(user_id);