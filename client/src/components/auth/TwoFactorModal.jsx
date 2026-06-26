import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck, Smartphone } from 'lucide-react';

const TwoFactorModal = ({ onClose, onVerify, loading }) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (next.every(d => d !== '')) onVerify(next.join(''));
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      onVerify(pasted);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>

        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Two-Factor Authentication
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          Enter the 6-digit code from your authenticator app
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }} onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1}
              inputMode="numeric"
              style={{
                width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                fontFamily: 'var(--font-display)',
                background: 'var(--bg-input)', border: `1px solid ${d ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none',
                transition: 'var(--transition)',
                boxShadow: d ? '0 0 0 3px var(--primary-subtle)' : 'none',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <Smartphone size={13} />
          Open your authenticator app for the code
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <span className="spinner" style={{ borderTopColor: 'var(--primary)' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorModal;