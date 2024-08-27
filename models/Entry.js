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
    type: String, // Ensure note is defined here
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
});

module.exports = mongoose.model('Entry', EntrySchema);
