import 'flatpickr/dist/flatpickr.min.css';
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import './Popup.css'; // Ensure you have the correct styles

const Popup = ({ handleClose, show, addData }) => {
  const [activeTab, setActiveTab] = useState('expense');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('');
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState('');
  const [otherDescription, setOtherDescription] = useState(''); // State for description if "Other" is selected
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR'); // Currency selector state
  const [filePath, setFilePath] = useState('');
  const [file, setFile] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedEmoji(''); // Reset emoji when changing tab
    setOtherDescription(''); // Reset other description when changing tab
  };

  const selectCategory = (category) => {
    if (activeTab === 'income') {
      setSelectedIncomeCategory(category.name);
    } else {
      setSelectedExpenseCategory(category.name);
    }
    setSelectedEmoji(category.emoji);
    setOtherDescription(''); // Clear description when selecting a category
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilePath(e.target.value);
  };

  const handleSave = () => {
    const category = activeTab === 'income' ? selectedIncomeCategory : selectedExpenseCategory;
    const description = category === 'Other' ? otherDescription : '';

    const newData = {
      id: Date.now(),
      date: date.toLocaleDateString(),
      category,
      description, // Store the description for "Other" category
      expense: activeTab === 'expense' && category !== 'Other' ? `${currency} ${amount}` : description,
      income: activeTab === 'income' && category !== 'Other' ? `${currency} ${amount}` : description,
      amount: parseFloat(amount),
    };

    addData(newData); // Add the new data to the table
    handleClose();    // Close the popup
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
                    options={{ dateFormat: 'Y-m-d' }}
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
                {selectedExpenseCategory === 'Other' && (
                  <div className="other-description-container">
                    <label htmlFor="otherDescription">Description</label>
                    <input
                      type="text"
                      id="otherDescription"
                      value={otherDescription}
                      onChange={(e) => setOtherDescription(e.target.value)}
                      placeholder="Enter description for Other"
                      required
                    />
                  </div>
                )}
                <div className="category-container">
                  <label>Category</label>
                  <input type="text" value={selectedExpenseCategory} readOnly />
                </div>
              </div>
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
                    options={{ dateFormat: 'Y-m-d' }}
                    className="flatpickr small-date"
                    value={date}
                    onChange={([date]) => setDate(date)}
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
                {selectedIncomeCategory === 'Other' && (
                  <div className="other-description-container">
                    <label htmlFor="otherDescription">Description</label>
                    <input
                      type="text"
                      id="otherDescription"
                      value={otherDescription}
                      onChange={(e) => setOtherDescription(e.target.value)}
                      placeholder="Enter description for Other"
                      required
                    />
                  </div>
                )}
                <div className="category-container">
                  <label>Category</label>
                  <input type="text" value={selectedIncomeCategory} readOnly />
                </div>
              </div>
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