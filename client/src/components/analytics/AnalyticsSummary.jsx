import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Activity } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { formatCurrency } from '../../utils/formatters';

const StatCard = ({ label, value, icon: Icon, color, bg, sub }) => (
  <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const AnalyticsSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    analyticsService.getSummary().then(({ data }) => setSummary(data)).catch(() => {});
  }, []);

  if (!summary) return null;

  const stats = [
    {
      label: 'Total Sent',
      value: formatCurrency(summary.total_sent),
      icon: ArrowUpRight,
      color: 'var(--red)',
      bg: 'var(--red-subtle)',
      sub: `${formatCurrency(summary.month_sent)} this month`,
    },
    {
      label: 'Total Received',
      value: formatCurrency(summary.total_received),
      icon: ArrowDownLeft,
      color: 'var(--green)',
      bg: 'var(--green-subtle)',
      sub: `${formatCurrency(summary.month_received)} this month`,
    },
    {
      label: 'Net Flow',
      value: formatCurrency(summary.total_received - summary.total_sent),
      icon: summary.total_received >= summary.total_sent ? TrendingUp : TrendingDown,
      color: summary.total_received >= summary.total_sent ? 'var(--green)' : 'var(--red)',
      bg: summary.total_received >= summary.total_sent ? 'var(--green-subtle)' : 'var(--red-subtle)',
      sub: 'All time balance flow',
    },
    {
      label: 'Transactions',
      value: summary.transaction_count.toLocaleString(),
      icon: Activity,
      color: 'var(--primary)',
      bg: 'var(--primary-subtle)',
      sub: 'Total completed',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
      {stats.map((s) => <StatCard key={s.label} {...s} />)}
    </div>
  );
};

export default AnalyticsSummary;