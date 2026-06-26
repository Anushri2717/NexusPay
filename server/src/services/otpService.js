const { authenticator } = require('otplib');

authenticator.options = {
  step: 30,
  window: 1,
};

const generateSecret = () => {
  return authenticator.generateSecret();
};

const generateOTP = (secret) => {
  return authenticator.generate(secret);
};

const verifyOTP = (token, secret) => {
  return authenticator.check(token, secret);
};

const getOTPUri = (secret, email, issuer = 'NexusPay') => {
  return authenticator.keyuri(email, issuer, secret);
};

module.exports = { generateSecret, generateOTP, verifyOTP, getOTPUri };