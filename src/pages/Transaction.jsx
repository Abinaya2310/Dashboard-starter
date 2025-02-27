import React, { useEffect, useState } from 'react';

const Transaction = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    date: '',
    narration: '',
    chqRefNo: '',
    valueDt: '',
    withdrawalAmt: '',
    depositAmt: '',
    closing: '',
    balance: '',
    categories: ''
  });

  useEffect(() => {
    // Fetch transactions from backend when the component loads
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      date: formData.date,
      narration: formData.narration,
      chqRefNo: formData.chqRefNo,
      valueDt: formData.valueDt,
      withdrawalAmt: Number(formData.withdrawalAmt) || 0,
      depositAmt: Number(formData.depositAmt) || 0,
      closing: formData.closing,
      balance: Number(formData.balance) || 0,
      categories: formData.categories
    };

    try {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error Response:', data);
        throw new Error(data.message || 'Failed to save transaction');
      }

      console.log('Transaction saved:', data);
      setTransactions(prev => [...prev, data]); // Add new transaction to state
      setIsPopupOpen(false);
      setFormData({ 
        date: '',
        narration: '',
        chqRefNo: '',
        valueDt: '',
        withdrawalAmt: '',
        depositAmt: '',
        closing: '',
        balance: '',
        categories: ''
      });

    } catch (error) {
      console.error('Error saving transaction:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Transaction</h1>
      
      <button onClick={() => setIsPopupOpen(!isPopupOpen)} style={{ padding: '10px', fontSize: '16px', backgroundColor: 'green', color: 'white' }}>
        + Add Transaction
      </button>

      {isPopupOpen && (
        <div style={{
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.9), rgba(255, 192, 203, 0.9))',
          backdropFilter: 'blur(10px)',
          padding: '30px',  
          borderRadius: '12px', 
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          width: '550px',  
          height: '550px', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <form onSubmit={handleSubmit}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'black' }}>Add Transaction</h2>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} placeholder="Date" required />
            <input type="text" name="narration" value={formData.narration} onChange={handleInputChange} placeholder="Narration" required />
            <input type="text" name="chqRefNo" value={formData.chqRefNo} onChange={handleInputChange} placeholder="Chq Ref No" />
            <input type="date" name="valueDt" value={formData.valueDt} onChange={handleInputChange} placeholder="Value Dt" required />
            <input type="number" name="withdrawalAmt" value={formData.withdrawalAmt} onChange={handleInputChange} placeholder="Withdrawal Amt" />
            <input type="number" name="depositAmt" value={formData.depositAmt} onChange={handleInputChange} placeholder="Deposit Amt" />
            <input type="text" name="closing" value={formData.closing} onChange={handleInputChange} placeholder="Closing" />
            <input type="number" name="balance" value={formData.balance} onChange={handleInputChange} placeholder="Balance" required />
            <input type="text" name="categories" value={formData.categories} onChange={handleInputChange} placeholder="Categories" required />
            <button type="submit" style={{
              background: 'black', 
              color: 'white', 
              padding: '10px', 
              borderRadius: '8px', 
              width: '100%', 
              marginTop: '10px'
            }}>Submit</button>
          </form>
          <button onClick={() => setIsPopupOpen(false)} style={{
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            background: 'red', 
            color: 'white', 
            borderRadius: '50%', 
            width: '30px', 
            height: '30px', 
            border: 'none',
            cursor: 'pointer'
          }}>X</button>
        </div>
      )}

      {transactions.length > 0 && (
        <div style={{ 
          maxHeight: '500px',  // Enables scrolling if entries exceed this height
          overflowY: 'auto',   // Vertical scroll
          overflowX: 'auto',   // Horizontal scroll (if needed)
          border: '2px solid black', 
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse' 
          }}>
            <thead style={{ background: 'plum', color: 'black' }}>
              <tr>
                {['Date', 'Narration', 'Chq Ref No', 'Value Dt', 'Withdrawal Amt', 'Deposit Amt', 'Closing', 'Balance', 'Categories']
                  .map((heading) => (
                    <th key={heading} style={{ 
                      border: '1px solid black', 
                      padding: '10px', 
                      textAlign: 'left' 
                    }}>
                      {heading}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} style={{ borderBottom: '1px solid black' }}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.date}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.narration}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.chqRefNo}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.valueDt}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.withdrawalAmt}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.depositAmt}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.closing}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.balance}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{transaction.categories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transaction;
