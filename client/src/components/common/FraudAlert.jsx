import React from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

const severityColors = {
  low: { bg: 'var(--amber-subtle)', border: 'rgba(245,158,11,0.2)', color: 'var(--amber)', icon: AlertTriangle },
  medium: { bg: 'var(--amber-subtle)', border: 'rgba(245,158,11,0.3)', color: 'var(--amber)', icon: AlertTriangle },
  high: { bg: 'var(--red-subtle)', border: 'rgba(239,68,68,0.2)', color: 'var(--red)', icon: ShieldAlert },
  critical: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)', color: 'var(--red)', icon: ShieldAlert },
};

const FraudAlert = ({ alerts = [], onDismiss }) => {
  if (!alerts.length) return null;
  const latest = alerts[0];
  const { bg, border, color, icon: Icon } = severityColors[latest.severity] || severityColors.medium;

  return (
    <div style={{
      background: bg, border: `1px solid ${border}`,
      borderRadius: 'var(--radius-lg)', padding: '16px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      marginBottom: 24, animation: 'slideUp 0.3s ease',
    }}>
      <Icon size={18} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 2 }}>
          Security Alert — {latest.severity.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {latest.description}
        </div>
        {latest.amount && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Transaction: ${parseFloat(latest.amount).toFixed(2)} · {latest.reference_id}
          </div>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default FraudAlert;