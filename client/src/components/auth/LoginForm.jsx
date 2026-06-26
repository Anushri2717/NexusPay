import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TwoFactorModal from './TwoFactorModal';
import { authService } from '../../services/authService';

const LoginForm = ({ onToast }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [tempToken, setTempToken] = useState('');

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('All fields required'); return; }
    setLoading(true);
    try {
      const result = await login(form);
      if (result.requires2FA) {
        setTempToken(result.tempToken);
        setShow2FA(true);
        return;
      }
      onToast?.('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (otp) => {
    setTwoFALoading(true);
    try {
      localStorage.setItem('nexuspay_token', tempToken);
      const { data } = await authService.verify2FA(otp);
      localStorage.setItem('nexuspay_token', data.token);
      onToast?.('Welcome back!', 'success');
      navigate('/dashboard');
    } catch {
      onToast?.('Invalid 2FA code', 'error');
      localStorage.removeItem('nexuspay_token');
    } finally {
      setTwoFALoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input ${error ? 'error' : ''}`}
            name="email" type="email" placeholder="you@example.com"
            value={form.email} onChange={handleChange} autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className={`form-input ${error ? 'error' : ''}`}
              style={{ paddingRight: 44 }}
              name="password" type={showPw ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password} onChange={handleChange} autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPw(p => !p)} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', padding: 4,
            }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--red-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--red)' }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: 4 }} disabled={loading}>
          {loading ? <span className="spinner" /> : <><LogIn size={16} /> Sign In</>}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
            Create one
          </Link>
        </p>
      </form>

      {show2FA && (
        <TwoFactorModal
          onClose={() => setShow2FA(false)}
          onVerify={handle2FAVerify}
          loading={twoFALoading}
        />
      )}
    </>
  );
};

export default LoginForm;