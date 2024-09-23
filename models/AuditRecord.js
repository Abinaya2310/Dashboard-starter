const mongoose = require('mongoose');

const AuditRecordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  date: {
    type: String,  // Store the date as a string for simplicity
    required: true,
  },
  category: {
    type: String,  // The category associated with the action
    required: true,
  },
  amount: {
    type: Number,  // The amount of income/expense
    required: true,
  },
  type: {
    type: String,  // Either 'income' or 'expense'
    required: true,
  },
  note: {
    type: String,  // Optional note
    default: '-',
  },
  sentence: {
    type: String,  // The generated sentence (e.g., "This ID has added...")
    required: true,
  },
});

module.exports = mongoose.model('AuditRecord', AuditRecordSchema);
