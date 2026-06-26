const rateLimit = require('express-rate-limit');

const auth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many auth attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const general = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const transactions = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { error: 'Transaction rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { auth, general, transactions };