// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Transaction date is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Revenue', 'Payroll', 'Operations', 'IT Expenses', 'Facilities', 'Marketing', 'Travel', 'Insurance', 'Tax','Other']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['income', 'expense']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Completed', 'Pending']
  },
  account: {
    type: String,
    required: [true, 'Account is required']
  },
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  client: {
    type: String,
    trim: true
  },
  vendor: {
    type: String,
    trim: true
  },
  invoice: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    enum: ['Finance', 'IT', 'Operations', 'Sales', 'Marketing', 'HR', 'All']
  },
  payment_id: {
    type: String,
    trim: true
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    ref: 'Company'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ companyId: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema); 