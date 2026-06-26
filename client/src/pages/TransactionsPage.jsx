import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../hooks/useToast';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFilter from '../components/transactions/TransactionFilter';
import Toast from '../components/common/Toast';
import { ArrowLeftRight, Download } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const TransactionsPage = () => {
  const { transactions, pagination, walletId, txLoading, fetchTransactions } = useWallet();
  const { toasts, toast, removeToast } = useToast();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const load = useCallback((f = filters, p = page) => {
    const params = { ...f, page: p, limit: 15 };
    // Remove empty strings
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    fetchTransactions(params);
  }, [filters, page, fetchTransactions]);

  useEffect(() => { load(); }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    const params = { ...newFilters, page: 1, limit: 15 };
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    fetchTransactions(params);
  };

  const handlePageChange = (p) => {
    setPage(p);
    const params = { ...filters, page: p, limit: 15 };
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    fetchTransactions(params);
  };

  const sentTotal = transactions.filter(t => t.sender_wallet_id === walletId && t.status === 'completed').reduce((s, t) => s + parseFloat(t.amount), 0);
  const receivedTotal = transactions.filter(t => t.receiver_wallet_id === walletId && t.status === 'completed').reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            Transactions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {pagination ? `${pagination.total} total transactions` : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Transactions', value: pagination?.total || 0, icon: ArrowLeftRight, color: 'var(--primary)', bg: 'var(--primary-subtle)', isCount: true },
          { label: 'Total Sent', value: sentTotal, icon: Download, color: 'var(--red)', bg: 'var(--red-subtle)', rotate: true },
          { label: 'Total Received', value: receivedTotal, icon: Download, color: 'var(--green)', bg: 'var(--green-subtle)' },
        ].map(({ label, value, icon: Icon, color, bg, isCount, rotate }) => (
          <div key={label} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color, transform: rotate ? 'rotate(180deg)' : 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                {isCount ? value.toLocaleString() : formatCurrency(value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <TransactionFilter filters={filters} onChange={handleFilterChange} />
        </div>
        <div style={{ padding: '8px 4px' }}>
          <TransactionList
            transactions={transactions}
            walletId={walletId}
            loading={txLoading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default TransactionsPage;