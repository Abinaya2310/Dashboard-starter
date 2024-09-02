const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  note: {
    type: String, 
    required: true,
  },
  expense: {
    type: String,
    default: '',
  },
  income: {
    type: String,
    default: '',
  },
  amount: {
    type: String,
    required: true,
  },
  totalIncome: {
    type: Number,
    default: 0,
    select: false, // Exclude this field from query results by default
  },
  totalExpense: {
    type: Number,
    default: 0,
    select: false, // Exclude this field from query results by default
  },
});

module.exports = mongoose.model('Entry', EntrySchema);

