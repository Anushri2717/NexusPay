import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, RotateCcw } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const typeConfig = {
  send: { icon: ArrowUpRight, color: 'var(--red)', bg: 'var(--red-subtle)', sign: '-' },
  receive: { icon: ArrowDownLeft, color: 'var(--green)', bg: 'var(--green-subtle)', sign: '+' },
  deposit: { icon: Plus, color: 'var(--cyan)', bg: 'var(--cyan-subtle)', sign: '+' },
  withdrawal: { icon: Minus, color: 'var(--amber)', bg: 'var(--amber-subtle)', sign: '-' },
  refund: { icon: RotateCcw, color: 'var(--primary)', bg: 'var(--primary-subtle)', sign: '+' },
};

const RecentActivity = ({ transactions = [], walletId }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>Recent Activity</h3>
        <button onClick={() => navigate('/transactions')} className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--primary)' }}>
          View all →
        </button>
      </div>

      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 14 }}>
          No transactions yet. Send or receive money to get started.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {transactions.slice(0, 6).map((tx) => {
            const isSender = tx.sender_wallet_id === walletId;
            const config = typeConfig[tx.type] || typeConfig.send;
            const { icon: Icon, color, bg, sign } = config;
            const displaySign = isSender && tx.type === 'send' ? '-' : '+';
            const displayColor = isSender && tx.type === 'send' ? 'var(--red)' : 'var(--green)';
            const counterparty = isSender ? tx.receiver_name || tx.receiver_address : tx.sender_name || tx.sender_address;

            return (
              <div key={tx.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tx.description || `${tx.type} · ${counterparty || 'Unknown'}`}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                    {formatRelativeTime(tx.created_at)} ·{' '}
                    <span style={{ color: tx.status === 'completed' ? 'var(--green)' : tx.status === 'flagged' ? 'var(--amber)' : 'var(--text-muted)' }}>
                      {tx.status}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: displayColor, flexShrink: 0 }}>
                  {displaySign}{formatCurrency(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;