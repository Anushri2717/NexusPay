import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import LoadingSpinner from '../common/LoadingSpinner';

const COLORS = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px',
    }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
        {payload[0].name}
      </p>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        ${parseFloat(payload[0].value).toFixed(2)} · {payload[0].payload.count} txns
      </p>
    </div>
  );
};

const CategoryBreakdown = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: res } = await analyticsService.getCategoryBreakdown();
        setData(res.categories.map(c => ({
          name: c.category,
          value: parseFloat(c.total),
          count: parseInt(c.count),
          average: parseFloat(c.average),
        })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="card"><LoadingSpinner /></div>;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 2 }}>
          Category Breakdown
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Spending by category this month</p>
      </div>

      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          No spending data yet
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                dataKey="value" paddingAngle={3} strokeWidth={0}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.slice(0, 5).map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', textTransform: 'capitalize', fontWeight: 500 }}>
                      {d.name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
                      ${d.value.toFixed(0)}
                    </span>
                  </div>
                  <div style={{
                    height: 4, background: 'var(--bg-elevated)', borderRadius: 2, marginTop: 4, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${total > 0 ? (d.value / total) * 100 : 0}%`,
                      background: COLORS[i % COLORS.length],
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;