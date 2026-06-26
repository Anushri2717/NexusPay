import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, LogOut, Wallet, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const { user, wallet, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside style={{
      width: 260, height: '100vh', position: 'fixed', left: 0, top: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
              NexusPay
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Digital Wallet</div>
          </div>
        </div>
      </div>

      {/* Balance snippet */}
      {wallet && (
        <div style={{ margin: '16px 16px 8px', padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-subtle)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500, marginBottom: 4 }}>Available Balance</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            ${parseFloat(wallet.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.05em' }}>
            {wallet.wallet_address?.slice(0, 8)}...{wallet.wallet_address?.slice(-4)}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'var(--transition)',
            background: isActive ? 'var(--primary-subtle)' : 'transparent',
            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: isActive ? 600 : 400,
            fontSize: 14,
          })}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
            flexShrink: 0,
          }}>
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.full_name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: 8 }}>
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;