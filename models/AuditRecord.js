const mongoose = require('mongoose');

const AuditRecordSchema = new mongoose.Schema({
 
  sentence: {
    type: String,  // The generated sentence (e.g., "This ID has added...")
    required: true,
  },
});

module.exports = mongoose.model('AuditRecord', AuditRecordSchema);
