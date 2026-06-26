import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../hooks/useToast';
import BalanceCard from '../components/dashboard/BalanceCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import SendMoneyModal from '../components/wallet/SendMoneyModal';
import AddFundsModal from '../components/wallet/AddFundsModal';
import FraudAlert from '../components/common/FraudAlert';
import Toast from '../components/common/Toast';

const DashboardPage = () => {
  const { user, wallet, updateWallet, refreshUser } = useAuth();
  const { transactions, walletId, fraudAlerts, txLoading, fetchTransactions, fetchFraudAlerts } = useWallet();
  const { toasts, toast, removeToast } = useToast();

  const [showSend, setShowSend] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  useEffect(() => {
    fetchTransactions({ limit: 8 });
    fetchFraudAlerts();
  }, []);

  const handleSendSuccess = (data) => {
    setShowSend(false);
    toast.success('Payment sent successfully');
    refreshUser();
    fetchTransactions({ limit: 8 });
  };

  const handleDepositSuccess = (data) => {
    setShowDeposit(false);
    toast.success(`Funds added successfully`);
    updateWallet({ balance: data.new_balance });
    fetchTransactions({ limit: 8 });
  };

  const handleFreeze = async () => {
    try {
      if (wallet?.is_frozen) {
        const { walletService } = await import('../services/walletService');
        await walletService.unfreeze();
        updateWallet({ is_frozen: false });
        toast.success('Wallet unfrozen');
      } else {
        const { walletService } = await import('../services/walletService');
        await walletService.freeze();
        updateWallet({ is_frozen: true });
        toast.warning('Wallet frozen for security');
      }
    } catch {
      toast.error('Action failed');
    }
  };

  const activeFraudAlerts = dismissedAlert ? [] : fraudAlerts.filter(a => !a.is_resolved);

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Here's what's happening with your wallet today
        </p>
      </div>

      {/* Fraud alert banner */}
      {activeFraudAlerts.length > 0 && (
        <FraudAlert alerts={activeFraudAlerts} onDismiss={() => setDismissedAlert(true)} />
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
        <BalanceCard wallet={wallet} />
        <QuickActions
          onSend={() => setShowSend(true)}
          onDeposit={() => setShowDeposit(true)}
          onFreeze={handleFreeze}
          isFrozen={wallet?.is_frozen}
        />
      </div>

      {/* Recent transactions */}
      <div className="card">
        <RecentActivity
          transactions={transactions}
          walletId={walletId}
          loading={txLoading}
        />
      </div>

      {/* Modals */}
      {showSend && (
        <SendMoneyModal
          balance={wallet?.balance}
          onClose={() => setShowSend(false)}
          onSuccess={handleSendSuccess}
        />
      )}
      {showDeposit && (
        <AddFundsModal
          onClose={() => setShowDeposit(false)}
          onSuccess={handleDepositSuccess}
        />
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default DashboardPage;