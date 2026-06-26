# NexusPay — Digital Wallet & Payments System

> A secure, full-stack peer-to-peer digital wallet with real-time fraud detection, two-factor authentication, and payment analytics.

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Stack](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Stack](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Stack](https://img.shields.io/badge/License-MIT-green)

---

## Features

| Feature | Details |
|---|---|
| **Wallet Balance** | Real-time balance display with show/hide toggle and wallet address copy |
| **P2P Payments** | Send money via wallet address with optional note and fee calculation |
| **Add Funds** | Deposit to wallet via quick-select or custom amount |
| **Transaction History** | Paginated list with type/status/date filters |
| **Fraud Detection** | Velocity checks, high-amount flags, new-receiver alerts, unusual-hour scoring |
| **Two-Factor Auth** | TOTP-based 2FA via Google Authenticator / Authy with QR code setup |
| **Payment Analytics** | Spending trend (area chart), category breakdown (pie), monthly comparison (bar) |
| **Email Alerts** | Transaction confirmations and fraud alert emails via Nodemailer |
| **Wallet Freeze** | One-tap wallet freeze/unfreeze for security |
| **Rate Limiting** | Per-route rate limiters to prevent brute force and abuse |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Recharts (analytics charts)
- Lucide React (icons)
- Axios

**Backend**
- Node.js + Express
- PostgreSQL (via `pg`)
- JWT authentication
- `otplib` for TOTP 2FA
- `bcryptjs` for password hashing
- Nodemailer for email
- Helmet + CORS + express-rate-limit

---

## Project Structure

```
nexuspay/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # auth, dashboard, wallet, transactions, analytics, common
│       ├── pages/        # LandingPage, Login, Register, Dashboard, Transactions, Analytics, Settings
│       ├── context/      # AuthContext, WalletContext
│       ├── hooks/        # useAuth, useWallet, useToast
│       ├── services/     # api, authService, walletService, transactionService, analyticsService
│       └── utils/        # formatters, validators
└── server/          # Express backend
    └── src/
        ├── controllers/  # auth, wallet, transaction, analytics
        ├── middleware/    # auth, fraudDetection, rateLimiter, errorHandler
        ├── models/       # User, Wallet, Transaction
        ├── routes/       # auth, wallet, transactions, analytics
        ├── services/     # emailService, otpService, fraudService
        └── config/       # database, env
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/nexuspay.git
cd nexuspay

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### 2. PostgreSQL Setup

```sql
CREATE DATABASE nexuspay_db;
```

Run migrations in order:
```bash
psql -U postgres -d nexuspay_db -f server/migrations/001_create_users.sql
psql -U postgres -d nexuspay_db -f server/migrations/002_create_wallets.sql
psql -U postgres -d nexuspay_db -f server/migrations/003_create_transactions.sql
```

### 3. Environment Variables

```bash
cd server
cp .env.example .env
# Fill in your values:
# DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
# JWT_SECRET (min 32 chars)
# EMAIL_USER, EMAIL_PASS (Gmail app password)
```

### 4. Run

Open two terminals:

```bash
# Terminal 1 — Backend
cd server && npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd client && npm run dev
# Runs on http://localhost:5173
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account + wallet |
| POST | `/api/auth/login` | Login (returns token or 2FA prompt) |
| POST | `/api/auth/verify-2fa` | Complete 2FA login |
| POST | `/api/auth/setup-2fa` | Generate QR code + secret |
| POST | `/api/auth/enable-2fa` | Confirm and enable 2FA |
| GET  | `/api/auth/me` | Get current user + wallet |

### Wallet
| Method | Endpoint | Description |
|---|---|---|
| GET  | `/api/wallet` | Get wallet info |
| POST | `/api/wallet/deposit` | Add funds |
| POST | `/api/wallet/send` | Send money (fraud-checked) |
| POST | `/api/wallet/freeze` | Freeze wallet |
| POST | `/api/wallet/unfreeze` | Unfreeze wallet |
| GET  | `/api/wallet/fraud-alerts` | Get fraud alert history |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | List with filters + pagination |
| GET | `/api/transactions/:id` | Single transaction detail |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/summary` | Totals: sent, received, count |
| GET | `/api/analytics/spending-trend` | Daily trend (7/30/90 days) |
| GET | `/api/analytics/category-breakdown` | Spend by category |
| GET | `/api/analytics/monthly-comparison` | 6-month bar chart data |

---

## Fraud Detection

The fraud engine scores each outgoing transaction (0.0–1.0) across four signals:

| Signal | Score | Trigger |
|---|---|---|
| Velocity | +0.40 | >5 transactions in 10 minutes |
| High Amount | +0.30 | Single transaction ≥ $10,000 |
| New Receiver | +0.10 | First time sending to this wallet |
| Unusual Hour | +0.10 | Transaction between 00:00–04:00 UTC |

Transactions scoring ≥ 0.6 are marked `flagged`, a `fraud_alert` record is created, and an email is sent to the user.

---

## Screenshots

> Dashboard · Transactions · Analytics · Settings — all in a dark space-navy UI with indigo accents.

---

> **Note:** This project uses a mock payment card for deposits. In production, integrate a real payment gateway (Stripe, Razorpay, etc.) for the deposit flow.