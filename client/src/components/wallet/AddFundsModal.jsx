import React, { useState } from 'react';
import { X, Download, CreditCard } from 'lucide-react';
import { walletService } from '../../services/walletService';
import { validateAmount } from '../../utils/validators';

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

const AddFundsModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateAmount(amount);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const { data } = await walletService.deposit(parseFloat(amount));
      onSuccess(data, `$${amount} added to your wallet`);
    } catch (err) {
      setError(err.response?.data?.error || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={16} style={{ color: 'var(--green)' }} />
            </div>
            <span className="modal-title">Add Funds</span>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>

        {/* Mock payment card */}
        <div style={{
          borderRadius: 'var(--radius-lg)', padding: '20px',
          background: 'linear-gradient(135deg, #1a1f3a, #0f1629)',
          border: '1px solid rgba(99,102,241,0.2)', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <CreditCard size={28} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Payment Method</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>•••• •••• •••• 4242</div>
          </div>
          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Default</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick amounts */}
          <div>
            <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Quick Select</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {QUICK_AMOUNTS.map((q) => (
                <button key={q} type="button"
                  onClick={() => { setAmount(String(q)); setError(''); }}
                  style={{
                    padding: '7px 14px', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${amount === String(q) ? 'var(--primary)' : 'var(--border)'}`,
                    background: amount === String(q) ? 'var(--primary-subtle)' : 'var(--bg-elevated)',
                    color: amount === String(q) ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'var(--transition)',
                  }}>
                  ${q}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Amount (USD)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16, fontWeight: 600 }}>$</span>
              <input
                className={`form-input ${error ? 'error' : ''}`}
                style={{ paddingLeft: 28 }}
                placeholder="0.00"
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
              />
            </div>
            {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, background: 'var(--green)', }} disabled={loading}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#0da271')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--green)')}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Download size={14} /> Add Funds</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFundsModal;