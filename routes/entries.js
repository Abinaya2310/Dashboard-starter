const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// GET all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new entry
router.post('/', async (req, res) => {
  const { id, date, category, note, expense, income, amount } = req.body;

  try {
    const newEntry = new Entry({ id, date, category, note, expense, income, amount });
    
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE an entry
router.delete('/:id', async (req, res) => {
  try {
    await Entry.findOneAndDelete({ id: req.params.id });
    res.json({ msg: 'Entry removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
