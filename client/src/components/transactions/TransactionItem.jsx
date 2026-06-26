import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const typeConfig = {
  send: { icon: ArrowUpRight, color: 'var(--red)', bg: 'var(--red-subtle)' },
  receive: { icon: ArrowDownLeft, color: 'var(--green)', bg: 'var(--green-subtle)' },
  deposit: { icon: Plus, color: 'var(--cyan)', bg: 'var(--cyan-subtle)' },
  withdrawal: { icon: Minus, color: 'var(--amber)', bg: 'var(--amber-subtle)' },
  refund: { icon: RotateCcw, color: 'var(--primary)', bg: 'var(--primary-subtle)' },
};

const statusColors = {
  completed: 'var(--green)',
  pending: 'var(--amber)',
  failed: 'var(--red)',
  flagged: 'var(--amber)',
  reversed: 'var(--text-muted)',
};

const TransactionItem = ({ tx, walletId }) => {
  const isSender = tx.sender_wallet_id === walletId;
  const config = typeConfig[tx.type] || typeConfig.send;
  const { icon: Icon, color, bg } = config;

  const displayAmount = tx.type === 'send' && isSender
    ? `-${formatCurrency(tx.amount)}`
    : `+${formatCurrency(tx.amount)}`;
  const amountColor = tx.type === 'send' && isSender ? 'var(--red)' : 'var(--green)';

  const counterparty = isSender
    ? (tx.receiver_name || tx.receiver_address || 'External')
    : (tx.sender_name || tx.sender_address || 'External');

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', borderRadius: 'var(--radius-md)',
      transition: 'var(--transition)', cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

      {/* Icon */}
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
        <Icon size={16} style={{ color }} />
        {tx.is_flagged && (
          <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={9} color="#000" />
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tx.description || `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} · ${counterparty}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDateTime(tx.created_at)}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, color: statusColors[tx.status] || 'var(--text-muted)', fontWeight: 500 }}>
            {tx.status}
          </span>
          {tx.reference_id && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{tx.reference_id.slice(-8)}</span>
            </>
          )}
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: amountColor }}>
          {displayAmount}
        </div>
        {tx.fee > 0 && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fee: {formatCurrency(tx.fee)}</div>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;