const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budgeted: {
    type: Number,
  },
  spent: {
    type: Number,
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    default: 'Medium',
  },
  date: {
    type: Date,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
}, {
  timestamps: true
});

const BudgetModel = mongoose.model("Budget", budgetSchema)

module.exports = BudgetModel;