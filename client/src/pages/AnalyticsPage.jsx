import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AnalyticsSummary from '../components/analytics/AnalyticsSummary';
import SpendingChart from '../components/analytics/SpendingChart';
import CategoryBreakdown from '../components/analytics/CategoryBreakdown';
import { analyticsService } from '../services/analyticsService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MonthlyChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getMonthlyComparison()
      .then(({ data: res }) => setData(res.monthly.map(m => ({
        month: m.month,
        Sent: parseFloat(m.sent),
        Received: parseFloat(m.received),
      }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ fontSize: 13, fontWeight: 600, color: p.fill }}>
            {p.name}: ${parseFloat(p.value).toFixed(2)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="card">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 2 }}>Monthly Comparison</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>6-month sent vs received overview</p>
      </div>
      {loading ? <LoadingSpinner /> : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="Sent" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Received" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
        {[{ color: '#ef4444', label: 'Sent' }, { color: '#10b981', label: 'Received' }].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsPage = () => (
  <div className="page-content">
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Analytics</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Track your spending patterns and financial health</p>
    </div>

    <AnalyticsSummary />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      <SpendingChart />
      <CategoryBreakdown />
    </div>

    <MonthlyChart />
  </div>
);

export default AnalyticsPage;