const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getTransactions, getTransaction } = require('../controllers/transactionController');

router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransaction);

module.exports = router;