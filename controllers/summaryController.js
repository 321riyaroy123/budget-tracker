const Transaction = require('../models/Transaction');

exports.getSummary = async (req, res) => {
  const { month, year } = req.query;

  const start = new Date(`${year}-${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const transactions = await Transaction.find({
    userId: req.user.id,
    date: { $gte: start, $lt: end }
  });

  let balance = 0, totalIncome = 0, totalExpense = 0;
  for (const t of transactions) {
    if (t.type === 'Income') totalIncome += t.amount;
    else totalExpense += t.amount;
  }
  balance = totalIncome - totalExpense;

  const recentTransactions = transactions.slice(0, 5);

  res.json({ balance, totalIncome, totalExpense, recentTransactions });
};
