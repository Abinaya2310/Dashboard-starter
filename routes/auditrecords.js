const express = require('express');
const router = express.Router();
const AuditRecord = require('../models/AuditRecord'); // Ensure the path to the model is correct

// GET all audit records from MongoDB
router.get('/', async (req, res) => {
  try {
    const auditRecords = await AuditRecord.find(); // Fetch all audit records
    res.json(auditRecords); // Send audit records back as JSON
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new audit record
router.post('/', async (req, res) => {
  const { id, date, category, amount, type, note, sentence } = req.body;
  
  try {
    const newAuditRecord = new AuditRecord({ id, date, category, amount, type, note, sentence });
    await newAuditRecord.save(); // Save the audit record
    res.status(201).json(newAuditRecord);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

