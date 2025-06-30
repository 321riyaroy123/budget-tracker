const Transaction = require('../models/Transaction');
const mongoose = require('mongoose')

exports.getCategorySummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const summary = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    console.error("Category summary error:", err);
    res.status(500).json({ message: "Failed to get category summary" });
  }
};
