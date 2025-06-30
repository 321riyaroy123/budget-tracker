const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getSummary, getTransactions, addTransaction,
  deleteTransaction, updateTransaction, getAnalytics
} = require('../controllers/transactionController');

router.get('/summary', auth, getSummary);
router.get('/transactions', auth, getTransactions);
router.post('/transactions', auth, addTransaction);
router.put('/transactions/:id', auth, updateTransaction);
router.delete('/transactions/:id', auth, deleteTransaction);
router.get('/analytics/category-summary', auth, getAnalytics);

module.exports = router;
