const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Get all expenses and incomes
router.get('/transactions', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const incomes = await Income.find();
    res.json({ expenses, incomes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new expense
router.post('/expenses', upload.single('file'), async (req, res) => {
  const { date, amount, category, emoji, filePath } = req.body;
  const file = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const expense = new Expense({ date, amount, category, emoji, filePath: file });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a new income
router.post('/incomes', upload.single('file'), async (req, res) => {
  const { date, amount, category, emoji, filePath } = req.body;
  const file = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const income = new Income({ date, amount, category, emoji, filePath: file });
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
