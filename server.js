
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const Entry = require('./models/Entry'); // Import the Entry model

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/entries', require('./routes/entries'));

// New route to calculate total income and expense
app.get('/api/total', async (req, res) => {
  try {
    const result = await Entry.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $toDouble: "$income" } },
          totalExpense: { $sum: { $toDouble: "$expense" } }
        }
      }
    ]);

    const totalIncome = result[0]?.totalIncome || 0;
    const totalExpense = result[0]?.totalExpense || 0;

    res.json({ totalIncome, totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

