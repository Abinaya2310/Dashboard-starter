const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const AuditRecord = require('../models/AuditRecord');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    console.log('Fetched transactions:', transactions);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).send('Server Error');
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  const { date, narration, chqRefNo, valueDt, withdrawalAmt, depositAmt, closing, balance, categories } = req.body;
  console.log('Received new transaction:', req.body);

  try {
    const newTransaction = new Transaction({
      date, narration, chqRefNo, valueDt, withdrawalAmt, depositAmt, closing, balance, categories
    });

    await newTransaction.save();
    console.log('Transaction saved:', newTransaction);

    const type = withdrawalAmt > 0 ? 'withdrawal' : 'deposit';
    const amount = withdrawalAmt > 0 ? withdrawalAmt : depositAmt;
    const auditMessage = `Added a ${type} transaction of INR ${amount} under ${categories} category on ${date}.`;

    const newAuditRecord = new AuditRecord({
      date, category: categories, amount, type, note: narration, sentence: auditMessage
    });

    await newAuditRecord.save();
    console.log('Audit record saved:', newAuditRecord);

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error('Error saving transaction:', err);
    res.status(500).send('Server Error');
  }
});

// PUT update a transaction
router.put('/:id', async (req, res) => {
  const { date, narration, chqRefNo, valueDt, withdrawalAmt, depositAmt, closing, balance, categories } = req.body;
  console.log('Updating transaction ID:', req.params.id);
  console.log('Updated data:', req.body);

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { date, narration, chqRefNo, valueDt, withdrawalAmt, depositAmt, closing, balance, categories },
      { new: true }
    );

    if (!updatedTransaction) {
      console.log('Transaction not found for update');
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    console.log('Transaction updated:', updatedTransaction);

    const type = withdrawalAmt > 0 ? 'withdrawal' : 'deposit';
    const amount = withdrawalAmt > 0 ? withdrawalAmt : depositAmt;
    const auditMessage = `Updated a ${type} transaction of INR ${amount} under ${categories} category on ${date}.`;

    const newAuditRecord = new AuditRecord({
      date, category: categories, amount, type, note: narration, sentence: auditMessage
    });

    await newAuditRecord.save();
    console.log('Audit record for update saved:', newAuditRecord);

    res.json(updatedTransaction);
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).send('Server Error');
  }
});

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  console.log('Deleting transaction ID:', req.params.id);

  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      console.log('Transaction not found for deletion');
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    console.log('Transaction deleted:', transaction);

    const type = transaction.withdrawalAmt > 0 ? 'withdrawal' : 'deposit';
    const amount = transaction.withdrawalAmt > 0 ? transaction.withdrawalAmt : transaction.depositAmt;
    const auditMessage = `Deleted a ${type} transaction of INR ${amount} under ${transaction.categories} category on ${transaction.date}.`;

    const newAuditRecord = new AuditRecord({
      date: transaction.date,
      category: transaction.categories,
      amount,
      type,
      note: transaction.narration,
      sentence: auditMessage
    });

    await newAuditRecord.save();
    console.log('Audit record for deletion saved:', newAuditRecord);

    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

