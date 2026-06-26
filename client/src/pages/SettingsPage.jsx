import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';
import { authService } from '../services/authService';
import { Shield, User, Bell, ShieldCheck, Copy, Check, QrCode } from 'lucide-react';

const Section = ({ title, desc, icon: Icon, children }) => (
  <div className="card" style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} style={{ color: 'var(--primary)' }} />
      </div>
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>{children}</div>
  </div>
);

const SettingsPage = () => {
  const { user, wallet, refreshUser } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [setup2FAMode, setSetup2FAMode] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSetup2FA = async () => {
    setLoading2FA(true);
    try {
      const { data } = await authService.setup2FA();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setSetup2FAMode(true);
    } catch {
      toast.error('Failed to set up 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!otpInput || otpInput.length !== 6) { toast.error('Enter 6-digit code'); return; }
    setLoading2FA(true);
    try {
      await authService.enable2FA(otpInput);
      toast.success('2FA enabled successfully');
      setSetup2FAMode(false);
      setOtpInput('');
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid code');
    } finally {
      setLoading2FA(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-content" style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage your account and security preferences</p>
      </div>

      {/* Profile */}
      <Section title="Profile" desc="Your account information" icon={User}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Full Name', value: user?.full_name },
            { label: 'Email', value: user?.email },
            { label: 'Phone', value: user?.phone || 'Not set' },
            { label: 'KYC Status', value: user?.kyc_status || 'pending' },
          ].map(({ label, value }) => (
            <div key={label} className="form-group">
              <label className="form-label">{label}</label>
              <div style={{
                padding: '10px 14px', background: 'var(--bg-input)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                fontSize: 14, color: 'var(--text-primary)',
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Wallet Info */}
      <Section title="Wallet" desc="Your wallet address and limits" icon={Shield}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Wallet Address</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                flex: 1, padding: '10px 14px', background: 'var(--bg-input)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                fontSize: 13, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '0.05em',
              }}>
                {wallet?.wallet_address}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(wallet?.wallet_address || ''); toast.success('Copied!'); }}
                className="btn btn-secondary btn-icon">
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Daily Limit', value: `$${parseFloat(wallet?.daily_limit || 5000).toLocaleString()}` },
              { label: 'Status', value: wallet?.is_frozen ? '🔒 Frozen' : '✅ Active' },
            ].map(({ label, value }) => (
              <div key={label} className="form-group">
                <label className="form-label">{label}</label>
                <div style={{ padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--text-primary)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 2FA */}
      <Section title="Two-Factor Authentication" desc="Add an extra layer of security to your account" icon={ShieldCheck}>
        {user?.two_factor_enabled ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} style={{ color: 'var(--green)' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>2FA is enabled</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your account is protected with TOTP authentication</div>
            </div>
          </div>
        ) : setup2FAMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            {qrCode && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={qrCode} alt="2FA QR Code" style={{ width: 180, height: 180, borderRadius: 12, background: '#fff', padding: 8 }} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Or enter secret manually</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <code style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--primary)', letterSpacing: '0.1em' }}>
                  {secret}
                </code>
                <button onClick={copySecret} className="btn btn-secondary btn-icon">
                  {copied ? <Check size={14} style={{ color: 'var(--green)' }} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">2. Enter the 6-digit code to verify</label>
              <input
                className="form-input"
                placeholder="000000"
                maxLength={6}
                value={otpInput}
                onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                style={{ fontFamily: 'monospace', fontSize: 18, letterSpacing: '0.2em', textAlign: 'center' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSetup2FAMode(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleEnable2FA} className="btn btn-primary" style={{ flex: 1 }} disabled={loading2FA}>
                {loading2FA ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Enable 2FA'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>2FA is not enabled</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Enable to protect your account with a time-based code</div>
            </div>
            <button onClick={handleSetup2FA} className="btn btn-primary" disabled={loading2FA} style={{ flexShrink: 0 }}>
              {loading2FA ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><QrCode size={14} /> Setup 2FA</>}
            </button>
          </div>
        )}
      </Section>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default SettingsPage;