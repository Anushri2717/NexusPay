import React from 'react';
import { Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import { useToast } from '../hooks/useToast';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: 20, position: 'relative',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'slideUp 0.3s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(99,102,241,0.4)',
          }}>
            <Zap size={24} color="#fff" fill="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Sign in to your NexusPay wallet
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <LoginForm onToast={(msg, type) => toast[type]?.(msg)} />
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default LoginPage;