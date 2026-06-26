import React from 'react';
import TransactionItem from './TransactionItem';
import LoadingSpinner from '../common/LoadingSpinner';
import { ArrowLeftRight } from 'lucide-react';

const TransactionList = ({ transactions, walletId, loading, pagination, onPageChange }) => {
  if (loading) return <LoadingSpinner />;

  if (!transactions.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ArrowLeftRight size={24} style={{ color: 'var(--text-muted)' }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>No transactions found</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {transactions.map(tx => (
          <TransactionItem key={tx.id} tx={tx} walletId={walletId} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px 0 4px' }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}>
            Previous
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', padding: '0 12px' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;