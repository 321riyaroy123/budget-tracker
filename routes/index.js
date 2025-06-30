const express = require('express');
const auth = require('../middleware/authMiddleware');
const authRoutes = require('./authRoutes');
const txnCtrl = require('../controllers/transactionController');
const summaryCtrl = require('../controllers/summaryController');
const analyticsCtrl = require('../controllers/analyticsController');

const router = express.Router();

router.use('/auth', authRoutes);

// Dashboard
router.get('/summary', auth, summaryCtrl.getSummary);

// Transactions
router.get('/transactions', auth, txnCtrl.getTransactions);
router.post('/transactions', auth, txnCtrl.addTransaction);
router.put('/transactions/:id', auth, txnCtrl.updateTransaction);
router.delete('/transactions/:id', auth, txnCtrl.deleteTransaction);

// Analytics
router.get('/analytics/category-summary', auth, analyticsCtrl.getCategorySummary);

module.exports = router;
