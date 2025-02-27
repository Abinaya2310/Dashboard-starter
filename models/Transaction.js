const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
   date: {
    type: String, // Could also use Date type if you prefer: type: Date
    required: true,
  },
  narration: {
    type: String,
    required: true,
  },
  chqRefNo: {
    type: String,
    default: '', // Optional field, so default is empty string
  },
  valueDt: {
    type: String, // Could also use Date type if you prefer: type: Date
    required: true,
  },
  withdrawalAmt: {
    type: Number, // Using Number for monetary values
    default: 0,
  },
  depositAmt: {
    type: Number, // Using Number for monetary values
    default: 0,
  },
  closing: {
    type: String, // Could be Number if it represents a balance
    default: '',
  },
  balance: {
    type: Number,
    required: true,
  },
  categories: {
    type: String, // Could be [String] if you want an array of categories
    required: true,
  },
  filePath: {
    type: String, // For storing file paths like in EntrySchema
    default: null,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Transaction', TransactionSchema);