import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const TransactionFilter = ({ filters, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          className="form-input"
          style={{ paddingLeft: 36, height: 38, fontSize: 13 }}
          placeholder="Search transactions..."
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Type filter */}
      <select
        className="form-input"
        style={{ height: 38, fontSize: 13, width: 'auto', paddingRight: 32, cursor: 'pointer' }}
        value={filters.type || ''}
        onChange={e => onChange({ ...filters, type: e.target.value })}>
        <option value="">All Types</option>
        <option value="send">Send</option>
        <option value="receive">Receive</option>
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
        <option value="refund">Refund</option>
      </select>

      {/* Status filter */}
      <select
        className="form-input"
        style={{ height: 38, fontSize: 13, width: 'auto', paddingRight: 32, cursor: 'pointer' }}
        value={filters.status || ''}
        onChange={e => onChange({ ...filters, status: e.target.value })}>
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
        <option value="flagged">Flagged</option>
      </select>

      {/* Date range */}
      <input
        type="date"
        className="form-input"
        style={{ height: 38, fontSize: 13, width: 'auto', colorScheme: 'dark' }}
        value={filters.start_date || ''}
        onChange={e => onChange({ ...filters, start_date: e.target.value })}
        placeholder="From"
      />
      <input
        type="date"
        className="form-input"
        style={{ height: 38, fontSize: 13, width: 'auto', colorScheme: 'dark' }}
        value={filters.end_date || ''}
        onChange={e => onChange({ ...filters, end_date: e.target.value })}
        placeholder="To"
      />
    </div>
  );
};

export default TransactionFilter;