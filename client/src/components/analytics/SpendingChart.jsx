import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: ${parseFloat(p.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
};

const SpendingChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: res } = await analyticsService.getSpendingTrend(period);
        setData(res.trend.map(d => ({
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          Sent: parseFloat(d.sent),
          Received: parseFloat(d.received),
        })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 2 }}>Spending Trend</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Money sent vs received over time</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[7, 30, 90].map(p => (
            <button key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '5px 12px', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 500,
                border: `1px solid ${period === p ? 'var(--primary)' : 'var(--border)'}`,
                background: period === p ? 'var(--primary-subtle)' : 'transparent',
                color: period === p ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'var(--transition)',
              }}>
              {p}d
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Sent" stroke="#ef4444" strokeWidth={2} fill="url(#sentGrad)" dot={false} />
            <Area type="monotone" dataKey="Received" stroke="#10b981" strokeWidth={2} fill="url(#receivedGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
        {[{ color: '#ef4444', label: 'Sent' }, { color: '#10b981', label: 'Received' }].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{ width: 24, height: 3, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingChart;