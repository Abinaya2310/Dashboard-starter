const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const AuditRecord = require('../models/AuditRecord');

// GET all entries from MongoDB
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find(); // Fetch all entries from MongoDB
    res.json(entries); // Send entries back to client as JSON
  } catch (err) {
    res.status(500).send('Server Error'); // Handle any errors
  }
});

// POST a new entry
router.post('/', async (req, res) => {
  const { id, date,time, category, note, expense, income, amount } = req.body;

  try {
    const newEntry = new Entry({ id, date,time,category, note, expense, income, amount });

    // Save the new entry
    await newEntry.save();

    // Determine whether it's an income or expense and construct the sentence
    const type = expense ? 'expense' : 'income';
    const amountValue = expense ? expense.split(' ')[1] : income.split(' ')[1]; // Extract the numeric value from the string
    const categoryType = type === 'expense' ? 'expense' : 'income';
    const auditMessage = `This ID has added a new entry for INR ${amountValue} (${categoryType}) under ${category} category on ${date}. ${note !== '-' ? `Note: ${note}` : 'No note added.'}`;

    // Create an audit record
    const newAuditRecord = new AuditRecord({
      id,
      date,
      category,
      amount: parseFloat(amount),
      type: categoryType,
      note,
      sentence: auditMessage
    });

    // Save the audit record
    await newAuditRecord.save();

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT update an entry
router.put('/:id', async (req, res) => {
  const { id, date, category, note, expense, income, amount } = req.body;

  try {
    // Find and update the entry in the database
    const updatedEntry = await Entry.findOneAndUpdate(
      { id: req.params.id },
      { date, category, note, expense, income, amount },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Create an audit record for the update
    const auditMessage = `This ID has updated an entry for INR ${amount} (${expense ? 'expense' : 'income'}) under ${category} category on ${date}. ${note !== '-' ? `Note: ${note}` : 'No note added.'}`;
    const newAuditRecord = new AuditRecord({
      id,
      date,
      category,
      amount,
      type: expense ? 'expense' : 'income',
      note,
      sentence: auditMessage
    });

    // Save the audit record
    await newAuditRecord.save();

    res.json(updatedEntry);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE an entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ id: req.params.id });

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Create an audit record for the deletion
    const auditMessage = `This ID has deleted an entry for INR ${entry.amount} (${entry.expense ? 'expense' : 'income'}) under ${entry.category} category on ${entry.date}.`;
    const newAuditRecord = new AuditRecord({
      id: entry.id,
      date: entry.date,
      category: entry.category,
      amount: entry.amount,
      type: entry.expense ? 'expense' : 'income',
      note: entry.note,
      sentence: auditMessage
    });

    // Save the audit record
    await newAuditRecord.save();

    res.json({ msg: 'Entry removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


module.exports = router;

