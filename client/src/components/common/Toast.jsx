import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const colors = {
  success: { bg: 'var(--green-subtle)', border: 'rgba(16,185,129,0.2)', color: 'var(--green)' },
  error: { bg: 'var(--red-subtle)', border: 'rgba(239,68,68,0.2)', color: 'var(--red)' },
  warning: { bg: 'var(--amber-subtle)', border: 'rgba(245,158,11,0.2)', color: 'var(--amber)' },
  info: { bg: 'var(--primary-subtle)', border: 'rgba(99,102,241,0.2)', color: 'var(--primary)' },
};

const ToastItem = ({ toast, onRemove }) => {
  const c = colors[toast.type] || colors.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
      borderRadius: 'var(--radius-md)', padding: '12px 16px',
      fontSize: 14, fontWeight: 500, minWidth: 280, maxWidth: 380,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      animation: 'slideUp 0.2s ease',
    }}>
      {icons[toast.type]}
      <span style={{ flex: 1, color: 'var(--text-primary)' }}>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-muted)', padding: 2, display: 'flex',
      }}>
        <X size={14} />
      </button>
    </div>
  );
};

const Toast = ({ toasts, removeToast }) => {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default Toast;