import React, { useState } from 'react';
import { X, Send, AlertTriangle } from 'lucide-react';
import { walletService } from '../../services/walletService';
import { validateAmount, validateWalletAddress } from '../../utils/validators';

const SendMoneyModal = ({ onClose, onSuccess, balance }) => {
  const [form, setForm] = useState({ address: '', amount: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fraudWarning, setFraudWarning] = useState(null);

  const validate = () => {
    const e = {};
    const addrErr = validateWalletAddress(form.address);
    const amtErr = validateAmount(form.amount);
    if (addrErr) e.address = addrErr;
    if (amtErr) e.amount = amtErr;
    if (parseFloat(form.amount) > parseFloat(balance)) e.amount = 'Insufficient balance';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await walletService.sendMoney({
        receiver_wallet_address: form.address,
        amount: parseFloat(form.amount),
        description: form.description,
      });

      if (data.is_flagged) {
        setFraudWarning('Transaction was sent but flagged for review. You will be notified.');
      }

      onSuccess(data, `$${form.amount} sent successfully`);
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Payment failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={16} style={{ color: 'var(--primary)' }} />
            </div>
            <span className="modal-title">Send Money</span>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>

        {fraudWarning && (
          <div style={{ background: 'var(--amber-subtle)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: 16, display: 'flex', gap: 8, fontSize: 13, color: 'var(--amber)' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            {fraudWarning}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Recipient Wallet Address</label>
            <input
              className={`form-input ${errors.address ? 'error' : ''}`}
              placeholder="NXP1234567890ABCD"
              value={form.address}
              onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            />
            {errors.address && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errors.address}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Amount (USD)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16, fontWeight: 600 }}>$</span>
              <input
                className={`form-input ${errors.amount ? 'error' : ''}`}
                style={{ paddingLeft: 28 }}
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Balance: ${parseFloat(balance || 0).toFixed(2)}</span>
            {errors.amount && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Note (optional)</label>
            <input
              className="form-input"
              placeholder="What's this for?"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          {errors.submit && (
            <div style={{ background: 'var(--red-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--red)' }}>
              {errors.submit}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Send size={14} /> Send</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMoneyModal;