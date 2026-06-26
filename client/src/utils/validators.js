export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => {
  if (password.length < 8) return 'At least 8 characters';
  return null;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return 'Enter a valid amount';
  if (num > 50000) return 'Amount exceeds single transaction limit ($50,000)';
  return null;
};

export const validateWalletAddress = (address) => {
  if (!address || address.trim().length === 0) return 'Wallet address required';
  if (!address.startsWith('NXP') || address.length < 10) return 'Invalid wallet address format';
  return null;
};