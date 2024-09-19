import 'flatpickr/dist/flatpickr.min.css';
import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import './Popup.css'; // Ensure you have the correct styles

const Popup = ({ handleClose, show, addData, editRow }) => {
  const [activeTab, setActiveTab] = useState('expense');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('');
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [note, setNote] = useState('-'); // State for the note

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  useEffect(() => {
    if (editRow) {
      setActiveTab(editRow.expense ? 'expense' : 'income');
      setDate(new Date(editRow.date));
      setAmount(editRow.amount);
      setCurrency(editRow.expense?.split(' ')[0] || editRow.income?.split(' ')[0] || 'INR');
      setNote(editRow.note); // Set note when editing
      if (editRow.expense) {
        setSelectedExpenseCategory(editRow.category);
      } else {
        setSelectedIncomeCategory(editRow.category);
      }
    }
  }, [editRow]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const selectCategory = (category) => {
    if (activeTab === 'income') {
      setSelectedIncomeCategory(category.name);
    } else {
      setSelectedExpenseCategory(category.name);
    }
  };

  const handleSave = async () => {
    try {
      const category = activeTab === 'income' ? selectedIncomeCategory : selectedExpenseCategory;

      // Validate required fields
      if (!category) {
        throw new Error('Category is required');
      }
      if (!amount || isNaN(amount)) {
        throw new Error('A valid amount is required');
      }

      const updatedData = {
        id: editRow ? editRow.id : Date.now(),
        date: date.toLocaleDateString(),
        category,
        expense: activeTab === 'expense' ? `${currency} ${amount}` : '',
        income: activeTab === 'income' ? `${currency} ${amount}` : '',
        amount: parseFloat(amount),
        note, // Add note to the data
      };

      // Check if we're editing or adding a new entry
      await addData(updatedData, !!editRow); // Pass 'true' if editing, 'false' if adding

      handleClose();
    } catch (error) {
      console.error('Error in handleSave:', error.message);
    }
  };

  const categories = {
    expense: [
      { name: 'Food', emoji: '🍽️' },
      { name: 'Shopping', emoji: '🛍️' },
      { name: 'Telephone', emoji: '📱' },
      { name: 'Education', emoji: '📚' },
      { name: 'Sport', emoji: '🏅' },
      { name: 'Social', emoji: '🤝' },
      { name: 'Clothing', emoji: '👗' },
      { name: 'Electronics', emoji: '🔌' },
      { name: 'Travel', emoji: '🌍' },
      { name: 'Health', emoji: '🩺' },
      { name: 'Pet', emoji: '🐾' },
      { name: 'Repair', emoji: '🛠️' },
      { name: 'Home', emoji: '🏡' },
      { name: 'Gift', emoji: '🎉' },
      { name: 'Donate', emoji: '💝' },
      { name: 'Snacks', emoji: '🍿' },
      { name: 'Child', emoji: '🍼' },
      { name: 'Vegetables', emoji: '🥕' },
      { name: 'Fruits', emoji: '🍍' },
      { name: 'Beauty', emoji: '💅' },
      { name: 'Transport', emoji: '🚗' },
      { name: 'Entertainment', emoji: '🎬' },
      { name: 'Money Transfer', emoji: '💸' },
      { name: 'Other', emoji: '🔍' }
    ],
    income: [
      { name: 'Salary', emoji: '💼' },
      { name: 'Business', emoji: '🏢' },
      { name: 'Investment', emoji: '📈' },
      { name: 'Stocks', emoji: '📊' },
      { name: 'Freelancing', emoji: '💻' },
      { name: 'Rental Income', emoji: '🏠' },
      { name: 'Interest', emoji: '💹' },
      { name: 'Dividend', emoji: '🏦' },
      { name: 'Selling Assets', emoji: '💲' },
      { name: 'Side Business', emoji: '👜' },
      { name: 'Other', emoji: '🔍' }
    ]
  };

  return (
    <div className={showHideClassName}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <div className="tab-container">
          <div
            className={`tab ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => handleTabClick('expense')}
          >
            Expenses
          </div>
          <div
            className={`tab ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => handleTabClick('income')}
          >
            Income
          </div>
        </div>
        <div className="form-sections">
          {activeTab === 'expense' && (
            <div className="form-section" id="expense">
              <div className="inputs">
                <div className="date-container">
                  <label htmlFor="expenseDate">Date</label>
                  <Flatpickr
                    options={{
                      dateFormat: 'Y-m-d',
                      maxDate: new Date() // This will disable future dates
                    }}
                    className="flatpickr small-date"
                    value={date}
                    onChange={([date]) => setDate(date)}
                    required
                  />
                </div>
                <div className="amount-container">
                  <label htmlFor="expenseAmount">Amount</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{ marginRight: '8px' }}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </select>
                    <input type="number" id="expenseAmount" name="expenseAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                </div>
                <div className="category-container">
                  <label>Category</label>
                  <input type="text" value={selectedExpenseCategory} readOnly />
                </div>
                <div className="note-container">
                  <label htmlFor="note">Note</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note"
                    rows="3"
                  />
                </div>
              </div>
              <p style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '10px', fontsize: '18px' }}>Select a category below:</p>
              <div className="icon-grid" id="expenseIconSelection">
                {categories.expense.map((category) => (
                  <div
                    key={category.name}
                    className={`icon-item ${selectedExpenseCategory === category.name ? 'selected' : ''}`}
                    onClick={() => selectCategory(category)}
                  >
                    <span role="img" aria-label={category.name}>{category.emoji}</span>
                    <p>{category.name}</p>
                  </div>
                ))}
              </div>
              <div className="save-container">
                <button id="saveExpenseBtn" onClick={handleSave}>Save Expense</button>
                <button onClick={handleClose}>Close</button>
              </div>
            </div>
          )}
          {activeTab === 'income' && (
            <div className="form-section" id="income">
              <div className="inputs">
                <div className="date-container">
                  <label htmlFor="incomeDate">Date</label>
                  <Flatpickr
                    options={{
                      dateFormat: 'Y-m-d',
                      maxDate: new Date(), // Dynamically sets today as the max date
                      disableMobile: true // Optional: Disable mobile native date picker to ensure Flatpickr is used
                    }}
                    className="flatpickr small-date"
                    value={date}
                    onChange={([selectedDate]) => setDate(selectedDate)}
                    required
                  />
                </div>
                <div className="amount-container">
                  <label htmlFor="incomeAmount">Amount</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{ marginRight: '8px' }}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </select>
                    <input type="number" id="incomeAmount" name="incomeAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                </div>
                <div className="category-container">
                  <label>Category</label>
                  <input type="text" value={selectedIncomeCategory} readOnly />
                </div>
                <div className="note-container">
                  <label htmlFor="note">Note</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note"
                    rows="3"
                  />
                </div>
              </div>
              <p style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '10px', fontSize: '20px' }}>Select a category below:</p>
              <div className="icon-grid" id="incomeIconSelection">
                {categories.income.map((category) => (
                  <div
                    key={category.name}
                    className={`icon-item ${selectedIncomeCategory === category.name ? 'selected' : ''}`}
                    onClick={() => selectCategory(category)}
                  >
                    <span role="img" aria-label={category.name}>{category.emoji}</span>
                    <p>{category.name}</p>
                  </div>
                ))}
              </div>
              <div className="save-container">
                <button id="saveIncomeBtn" onClick={handleSave}>Save Income</button>
                <button onClick={handleClose}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;

