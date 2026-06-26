import React, { createContext, useContext, useState, useCallback } from 'react';
import { walletService } from '../services/walletService';
import { transactionService } from '../services/transactionService';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  const fetchTransactions = useCallback(async (params = {}) => {
    setTxLoading(true);
    try {
      const { data } = await transactionService.getTransactions(params);
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } finally {
      setTxLoading(false);
    }
  }, []);

  const fetchFraudAlerts = useCallback(async () => {
    try {
      const { data } = await walletService.getFraudAlerts();
      setFraudAlerts(data.alerts);
    } catch {}
  }, []);

  return (
    <WalletContext.Provider value={{
      transactions, pagination, fraudAlerts, txLoading,
      fetchTransactions, fetchFraudAlerts,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};