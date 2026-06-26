import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, BarChart3, ArrowRight, Send, Lock, Bell, Globe } from 'lucide-react';

const Feature = ({ icon: Icon, title, desc, color, bg }) => (
  <div className="card" style={{ transition: 'var(--transition-slow)' }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '33'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-card)'; }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
      <Icon size={22} style={{ color }} />
    </div>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
  </div>
);

const features = [
  {
    icon: Send, title: 'Instant P2P Payments', color: 'var(--primary)', bg: 'var(--primary-subtle)',
    desc: 'Send money to anyone in seconds using their wallet address. Zero delays, zero hassle.',
  },
  {
    icon: Shield, title: 'Fraud Detection', color: 'var(--green)', bg: 'var(--green-subtle)',
    desc: 'AI-powered fraud scoring flags suspicious transactions in real-time before they go through.',
  },
  {
    icon: Lock, title: 'Two-Factor Auth', color: 'var(--cyan)', bg: 'var(--cyan-subtle)',
    desc: 'Every login and high-risk action protected by TOTP-based two-factor authentication.',
  },
  {
    icon: BarChart3, title: 'Payment Analytics', color: 'var(--amber)', bg: 'var(--amber-subtle)',
    desc: 'Visualise your spending trends, category breakdowns, and monthly flow at a glance.',
  },
  {
    icon: Bell, title: 'Smart Alerts', color: '#ec4899', bg: 'rgba(236,72,153,0.1)',
    desc: 'Instant email notifications for every transaction, flag, and security event.',
  },
  {
    icon: Globe, title: 'Multi-Currency Ready', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    desc: 'Built for global use. Wallet infrastructure supports multiple currency configurations.',
  },
];

const LandingPage = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-base)', overflowX: 'hidden' }}>
    {/* Nav */}
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 60px', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, background: 'rgba(8,11,20,0.85)',
      backdropFilter: 'blur(12px)', zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99,102,241,0.4)',
        }}>
          <Zap size={16} color="#fff" fill="#fff" />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>NexusPay</span>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/login" className="btn btn-ghost">Sign In</Link>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </div>
    </nav>

    {/* Hero */}
    <section style={{ padding: '100px 60px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--primary-subtle)', border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 'var(--radius-full)', padding: '6px 16px',
        fontSize: 13, color: 'var(--primary)', fontWeight: 500, marginBottom: 28,
        animation: 'fadeIn 0.5s ease',
      }}>
        <Zap size={13} fill="currentColor" />
        The future of digital payments is here
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(36px, 6vw, 72px)',
        lineHeight: 1.1, letterSpacing: '-0.03em',
        marginBottom: 24, animation: 'slideUp 0.5s ease',
      }}>
        Send Money{' '}
        <span className="gradient-text">Instantly,</span>
        <br />Securely & Smartly
      </h1>

      <p style={{
        fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520,
        margin: '0 auto 40px', lineHeight: 1.7,
        animation: 'slideUp 0.5s ease 0.1s both',
      }}>
        A modern peer-to-peer digital wallet with real-time fraud detection,
        two-factor security, and beautiful analytics — all in one place.
      </p>

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', animation: 'slideUp 0.5s ease 0.2s both' }}>
        <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: 10, fontSize: 16 }}>
          Create Free Wallet <ArrowRight size={16} />
        </Link>
        <Link to="/login" className="btn btn-secondary btn-lg" style={{ fontSize: 16 }}>
          Sign In
        </Link>
      </div>

      {/* Mock dashboard preview */}
      <div style={{
        marginTop: 72, maxWidth: 860, margin: '72px auto 0',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: 24,
        boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
        animation: 'slideUp 0.6s ease 0.3s both',
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['#ef4444', '#f59e0b', '#10b981'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Balance', value: '$24,831.00', color: '#fff' },
            { label: 'Sent Today', value: '$1,240.00', color: '#ef4444' },
            { label: 'Received', value: '$3,660.00', color: '#10b981' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: 12, padding: '16px 20px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 60, background: 'var(--bg-surface)', borderRadius: 12, marginTop: 12, border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={14} style={{ color: 'var(--green)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Payment to Arjun S.</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>completed · just now</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ef4444' }}>-$500.00</div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: '60px 60px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
          Everything you need
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Enterprise-grade features, consumer-friendly experience</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
        {features.map(f => <Feature key={f.title} {...f} />)}
      </div>
    </section>

    {/* Footer */}
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Zap size={14} style={{ color: 'var(--primary)' }} />
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>NexusPay © 2025</span>
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Built with React · Node.js · PostgreSQL</span>
    </footer>
  </div>
);

export default LandingPage;