// Import necessary modules
const express = require('express');
const router = express.Router();
const AuditRecord = require('../models/AuditRecord'); // Adjust path if necessary


// GET all audit records from MongoDB
router.get('/', async (req, res) => {
  try {
    console.log("Fetching all audit records from the database..."); // Log the fetching process
    const auditRecords = await AuditRecord.find(); // Fetch all audit records
    console.log("Audit records fetched successfully:", auditRecords); // Log the fetched records
    res.json(auditRecords); // Send audit records back as JSON
  } catch (err) {
    console.error("Error fetching audit records:", err); // Log any errors
    res.status(500).send('Server Error');
  }
});

// POST a new audit record
router.post('/', async (req, res) => {
  const { id, date, category, amount, type, note, sentence } = req.body;
  console.log("Received new audit record data:", req.body); // Log the incoming data
  
  try {
    const newAuditRecord = new AuditRecord({ id, date, category, amount, type, note, sentence });
    await newAuditRecord.save(); // Save the audit record
    console.log("New audit record saved successfully:", newAuditRecord); // Log the saved record
    res.status(201).json(newAuditRecord);
  } catch (err) {
    console.error("Error saving new audit record:", err); // Log any errors during the save process
    res.status(500).send('Server Error');
  }
});

module.exports = router;


