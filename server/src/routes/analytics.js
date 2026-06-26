const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getSummary, getSpendingTrend, getCategoryBreakdown, getMonthlyComparison } = require('../controllers/analyticsController');

router.get('/summary', authenticate, getSummary);
router.get('/spending-trend', authenticate, getSpendingTrend);
router.get('/category-breakdown', authenticate, getCategoryBreakdown);
router.get('/monthly-comparison', authenticate, getMonthlyComparison);

module.exports = router;