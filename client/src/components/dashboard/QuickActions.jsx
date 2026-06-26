import React from 'react';
import { Send, Download, Shield, ShieldOff, QrCode } from 'lucide-react';

const QuickActions = ({ onSend, onDeposit, onFreeze, isFrozen }) => {
  const actions = [
    { icon: Send, label: 'Send', onClick: onSend, color: 'var(--primary)', bg: 'var(--primary-subtle)' },
    { icon: Download, label: 'Add Funds', onClick: onDeposit, color: 'var(--green)', bg: 'var(--green-subtle)' },
    {
      icon: isFrozen ? ShieldOff : Shield,
      label: isFrozen ? 'Unfreeze' : 'Freeze',
      onClick: onFreeze,
      color: 'var(--amber)',
      bg: 'var(--amber-subtle)',
    },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
        Quick Actions
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {actions.map(({ icon: Icon, label, onClick, color, bg }) => (
          <button key={label} onClick={onClick} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            padding: '20px 12px', borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)', border: '1px solid var(--border-card)',
            cursor: 'pointer', transition: 'var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = color + '33'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-card)'; }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} style={{ color }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;