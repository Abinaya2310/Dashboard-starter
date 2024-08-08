import axios from 'axios';
import 'flatpickr/dist/flatpickr.min.css';
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import './Popup.css'; // Ensure you have the correct styles

const Popup = ({ handleClose, show, addData }) => {
  const [activeTab, setActiveTab] = useState('expense');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('');
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [filePath, setFilePath] = useState('');
  const [file, setFile] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedEmoji(''); // Reset emoji when changing tab
  };

  const selectCategory = (category) => {
    if (activeTab === 'income') {
      setSelectedIncomeCategory(category.name);
    } else {
      setSelectedExpenseCategory(category.name);
    }
    setSelectedEmoji(category.emoji);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilePath(e.target.value);
  };

  const handleSave = async () => {
    const category = activeTab === 'income' ? selectedIncomeCategory : selectedExpenseCategory;

    const formData = new FormData();
    formData.append('date', date);
    formData.append('amount', amount);
    formData.append('category', category);
    formData.append('emoji', selectedEmoji);
    formData.append('filePath', filePath);
    if (file) {
      formData.append('file', file);
    }

    console.log("Form Data to be sent:", {
      date,
      amount,
      category,
      emoji: selectedEmoji,
      filePath,
      file
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/${activeTab === 'income' ? 'incomes' : 'expenses'}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Response data:", response.data);
      addData({
        id: Date.now(),
        date,
        expense: activeTab === 'expense' ? amount : '',
        income: activeTab === 'income' ? amount : '',
        file: file ? file.name : '',
        amount
      }); // Add the new data to the table
      handleClose();
    } catch (error) {
      console.error("There was an error saving data!", error);
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
                    options={{ dateFormat: 'Y-m-d' }}
                    className="flatpickr"
                    value={date}
                    onChange={([date]) => setDate(date)}
                    required
                  />
                </div>
                <div className="amount-container">
                  <label htmlFor="expenseAmount">Amount</label>
                  <input type="number" id="expenseAmount" name="expenseAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
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
              <div className="upload-container">
                <label htmlFor="expenseFile">Upload File:</label>
                <input type="file" id="expenseFile" onChange={handleFileChange} />
                <label htmlFor="expenseNote">Path:</label>
                <input type="text" id="expenseNote" value={filePath} onChange={(e) => setFilePath(e.target.value)} />
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
                    className="flatpickr"
                    value={date}
                    onChange={([date]) => setDate(date)}
                    required
                  />
                </div>
                <div className="amount-container">
                  <label htmlFor="incomeAmount">Amount</label>
                  <input type="number" id="incomeAmount" name="incomeAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
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
              <div className="upload-container">
                <label htmlFor="incomeFile">Upload File:</label>
                <input type="file" id="incomeFile" onChange={handleFileChange} />
                <label htmlFor="incomeNote">Path:</label>
                <input type="text" id="incomeNote" value={filePath} onChange={(e) => setFilePath(e.target.value)} />
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



