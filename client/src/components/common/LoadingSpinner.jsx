import React from 'react';

const LoadingSpinner = ({ size = 40, fullPage = false }) => {
  const spinner = (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(99,102,241,0.15)`,
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );

  if (fullPage) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-base)',
        flexDirection: 'column', gap: 16,
      }}>
        {spinner}
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading NexusPay...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;