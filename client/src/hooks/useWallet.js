import { useState, useCallback } from 'react';
import { walletService } from '../services/walletService';
import { transactionService } from '../services/transactionService';

export const useWallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [walletId, setWalletId] = useState(null);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const fetchTransactions = useCallback(async (params = {}) => {
    setTxLoading(true);
    try {
      const { data } = await transactionService.getTransactions(params);
      setTransactions(data.transactions);
      setPagination(data.pagination);
      if (data.wallet_id) setWalletId(data.wallet_id);
    } catch (err) {
      console.error('Failed to fetch transactions:', err.message);
    } finally {
      setTxLoading(false);
    }
  }, []);

  const fetchFraudAlerts = useCallback(async () => {
    setAlertsLoading(true);
    try {
      const { data } = await walletService.getFraudAlerts();
      setFraudAlerts(data.alerts);
    } catch (err) {
      console.error('Failed to fetch fraud alerts:', err.message);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  const sendMoney = useCallback(async (payload) => {
    const { data } = await walletService.sendMoney(payload);
    return data;
  }, []);

  const deposit = useCallback(async (amount) => {
    const { data } = await walletService.deposit(amount);
    return data;
  }, []);

  const freezeWallet = useCallback(async () => {
    const { data } = await walletService.freeze();
    return data;
  }, []);

  const unfreezeWallet = useCallback(async () => {
    const { data } = await walletService.unfreeze();
    return data;
  }, []);

  return {
    transactions,
    pagination,
    walletId,
    fraudAlerts,
    txLoading,
    alertsLoading,
    fetchTransactions,
    fetchFraudAlerts,
    sendMoney,
    deposit,
    freezeWallet,
    unfreezeWallet,
  };
};