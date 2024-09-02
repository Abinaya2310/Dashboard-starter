import axios from 'axios';
import { useEffect, useState } from 'react';

const Cards = () => {
  const [entries, setEntries] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/api/all-entries'); // Fetch all entries from the backend
        console.log('Fetched Entries:', response.data); // Log fetched entries
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries(); // Call the function to fetch entries when the component mounts
  }, []);

  useEffect(() => {
    const calculateTotals = () => {
      let incomeSum = 0;
      let expenseSum = 0;

      entries.forEach(entry => {
        const income = parseFloat(entry.income) || 0;
        const expense = parseFloat(entry.expense) || 0;

        incomeSum += income;
        expenseSum += expense;
      });

      console.log('Total Income:', incomeSum, 'Total Expense:', expenseSum); // Log calculated totals
      setTotalIncome(incomeSum);
      setTotalExpense(expenseSum);
    };

    if (entries.length > 0) {
      calculateTotals();
    }
  }, [entries]); // Recalculate totals whenever entries change

};

export default Cards;


