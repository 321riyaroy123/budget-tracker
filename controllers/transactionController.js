const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// 📊 Get summary (balance, income, expenses, last 5 transactions)
exports.getSummary = async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.id;

  try {
    const matchQuery = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      matchQuery.date = { $gte: start, $lt: end };
    }

    const transactions = await Transaction.find(matchQuery).sort({ date: -1 });

    const totalIncome = transactions
      .filter(tx => tx.type === 'Income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
      .filter(tx => tx.type === 'Expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = totalIncome - totalExpense;

    const recentTransactions = transactions.slice(0, 5);

    res.json({ balance, totalIncome, totalExpense, recentTransactions });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 📄 Get all transactions (with filters)
exports.getTransactions = async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate, category, description } = req.query;

  try {
    const query = { userId: new mongoose.Types.ObjectId(userId) };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) query.category = category;
    if (description) query.description = new RegExp(description, 'i');

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ➕ Add a transaction
exports.addTransaction = async (req, res) => {
  const { date, description, amount, category, type } = req.body;
  console.log('req.user:', req.user);
  console.log('req.body:', req.body);
  if (!date || !description || !amount || !category || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const transaction = await Transaction.create({
      userId: req.user.id,
      date,
      description,
      amount,
      category,
      type
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Transaction error:', err);
    res.status(500).json({ message: 'Failed to add transaction' });
  }
};

// 🗑️ Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;

  try {
    const result = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId
    });

    if (!result) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete' });
  }
};

// 📝 Update a transaction
exports.updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;
  console.log(transactionId)
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update' });
  }
};

// 📈 Get analytics (total per category)
exports.getAnalytics = async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.id;

  try {
    const matchQuery = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      matchQuery.date = { $gte: start, $lt: end };
    }

    const summary = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get analytics' });
  }
};
