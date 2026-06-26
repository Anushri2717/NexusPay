import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const BalanceCard = ({ wallet }) => {
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(wallet?.wallet_address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 'var(--radius-xl)',
      padding: '32px',
      background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #1a2340 100%)',
      border: '1px solid rgba(99,102,241,0.2)',
      boxShadow: '0 0 40px rgba(99,102,241,0.1)',
      minHeight: 200,
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 160, height: 160,
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -20, left: 80, width: 120, height: 120,
        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Total Balance
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {wallet?.is_frozen && (
            <span className="badge badge-red" style={{ fontSize: 11 }}>
              <Shield size={11} /> Frozen
            </span>
          )}
          <button onClick={() => setHidden(!hidden)} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            display: 'flex', transition: 'var(--transition)',
          }}>
            {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Balance */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.03em',
          fontSize: hidden ? 32 : 42, color: '#fff', lineHeight: 1.1,
          transition: 'var(--transition)',
        }}>
          {hidden ? '••••••' : formatCurrency(wallet?.balance || 0)}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
          {wallet?.currency || 'USD'} · Daily limit {formatCurrency(wallet?.daily_limit || 5000)}
        </div>
      </div>

      {/* Wallet address */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.05)', borderRadius: 10,
        padding: '10px 14px', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
            Wallet Address
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}>
            {wallet?.wallet_address || 'Loading...'}
          </div>
        </div>
        <button onClick={copy} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
          padding: 8, cursor: 'pointer', color: copied ? 'var(--green)' : 'rgba(255,255,255,0.5)',
          display: 'flex', transition: 'var(--transition)',
        }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;