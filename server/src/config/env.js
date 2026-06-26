const required = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
];

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`❌ Missing required env variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

const config = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'NexusPay <noreply@nexuspay.com>',
  },

  fraud: {
    velocityWindowMinutes: parseInt(process.env.FRAUD_VELOCITY_WINDOW_MINUTES) || 10,
    maxTransactions: parseInt(process.env.FRAUD_MAX_TRANSACTIONS) || 5,
    highAmountThreshold: parseFloat(process.env.FRAUD_HIGH_AMOUNT_THRESHOLD) || 10000,
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

module.exports = { config, validateEnv };