const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
