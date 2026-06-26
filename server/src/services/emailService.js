const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTransactionAlert = async (toEmail, transaction) => {
  const { type, amount, currency, status, reference_id } = transaction;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `NexusPay: Transaction ${status} — ${reference_id}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f0f13;color:#fff;border-radius:12px;">
        <h2 style="color:#6366f1;">NexusPay Transaction Alert</h2>
        <p>Your transaction has been <strong>${status}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="padding:8px;color:#aaa;">Type</td><td style="padding:8px;">${type}</td></tr>
          <tr><td style="padding:8px;color:#aaa;">Amount</td><td style="padding:8px;">${currency} ${amount}</td></tr>
          <tr><td style="padding:8px;color:#aaa;">Reference</td><td style="padding:8px;">${reference_id}</td></tr>
        </table>
        <p style="margin-top:24px;color:#aaa;font-size:12px;">If you did not initiate this transaction, contact support immediately.</p>
      </div>
    `,
  });
};

const sendFraudAlert = async (toEmail, alertDetails) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: '🚨 NexusPay Security Alert — Suspicious Activity Detected',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f0f13;color:#fff;border-radius:12px;">
        <h2 style="color:#ef4444;">⚠️ Suspicious Activity Detected</h2>
        <p>${alertDetails.description}</p>
        <p style="color:#aaa;font-size:12px;">If this was you, you can ignore this email. Otherwise, freeze your wallet immediately from the NexusPay app.</p>
      </div>
    `,
  });
};

const sendWelcomeEmail = async (toEmail, fullName) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Welcome to NexusPay 🚀',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f0f13;color:#fff;border-radius:12px;">
        <h2 style="color:#6366f1;">Welcome, ${fullName}!</h2>
        <p>Your NexusPay wallet is ready. Send, receive, and manage money securely.</p>
      </div>
    `,
  });
};

module.exports = { sendTransactionAlert, sendFraudAlert, sendWelcomeEmail };