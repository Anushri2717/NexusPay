const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateWalletAddress = () => {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  return `NXP${uuid.substring(0, 16)}`;
};

const generateReferenceId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateWalletAddress,
  generateReferenceId,
};