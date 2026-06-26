import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';

const RegisterForm = ({ onToast }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name required';
    if (!validateEmail(form.email)) e.email = 'Valid email required';
    const pwErr = validatePassword(form.password);
    if (pwErr) e.password = pwErr;
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      onToast?.('Account created! Welcome to NexusPay 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const strengthScore = () => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const score = strengthScore();
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input className={`form-input ${errors.full_name ? 'error' : ''}`}
          name="full_name" placeholder="Jane Doe"
          value={form.full_name} onChange={handleChange} />
        {errors.full_name && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errors.full_name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input className={`form-input ${errors.email ? 'error' : ''}`}
          name="email" type="email" placeholder="you@example.com"
          value={form.email} onChange={handleChange} autoComplete="email" />
        {errors.email && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Phone (optional)</label>
        <input className="form-input" name="phone" type="tel" placeholder="+91 9876543210"
          value={form.phone} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            className={`form-input ${errors.password ? 'error' : ''}`}
            style={{ paddingRight: 44 }}
            name="password" type={showPw ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={form.password} onChange={handleChange} />
          <button type="button" onClick={() => setShowPw(p => !p)} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', padding: 4,
          }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {form.password && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 4 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= score ? strengthColors[score] : 'var(--bg-elevated)',
                transition: 'background 0.3s ease',
              }} />
            ))}
            <span style={{ fontSize: 11, color: strengthColors[score], marginLeft: 6, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {strengthLabels[score]}
            </span>
          </div>
        )}
        {errors.password && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errors.password}</span>}
      </div>

      {errors.submit && (
        <div style={{ background: 'var(--red-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--red)' }}>
          {errors.submit}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: 4 }} disabled={loading}>
        {loading ? <span className="spinner" /> : <><UserPlus size={16} /> Create Account</>}
      </button>

      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;