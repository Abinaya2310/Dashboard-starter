import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search'; // Import modern search icon
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment, // Replaced input with MUI TextField
  Table as MuiTable,
  Paper,
  Snackbar,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, // Added for the search icon placement
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
import Popup from '../Popup/Popup';
import './Table.css';

export default function CustomTable() {
  const [data, setData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [viewRow, setViewRow] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const newRowRef = useRef(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/entries');
      if (response.status === 200) {
        setData(response.data);
        calculateTotals(response.data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data', error.message);
    }
  };

  const addEntry = async (newData) => {
    try {
      const currentISTDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const newDataWithTime = { ...newData, date: currentISTDateTime, currency: newData.currency || 'INR' };
      const response = await axios.post('http://localhost:3000/api/entries', newDataWithTime);
      setData((prevData) => [response.data, ...prevData]);
      setSelectedRowId(response.data.id);

      setTimeout(() => {
        if (newRowRef.current) {
          newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      setSuccessMessage('Entry added successfully!');
      calculateTotals([response.data, ...data]);
    } catch (error) {
      console.error('Error adding data', error);
    }
  };
  const updateEntry = async (updatedData) => {
    try {
      // Capture the current date and time in IST
      const currentISTDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const currentISTDate = currentISTDateTime.split(", ")[0];
      const currentISTTime = currentISTDateTime.split(", ")[1];
  // Log the captured date and time
console.log("Current IST Date:", currentISTDate);
console.log("Current IST Time:", currentISTTime);
      // Update the date and time fields in the updatedData object
      updatedData.date = currentISTDate;
      updatedData.time = currentISTTime;
  
      // Log to ensure the data contains the time
      console.log("Updated Data to be sent to the server:", updatedData);
  
      const response = await axios.put(`http://localhost:3000/api/entries/${updatedData.id}`, updatedData);
  
      if (response.status === 200) {
        // Update the state with the new data including the updated time
        setData((prevData) => prevData.map((row) => (row.id === updatedData.id ? updatedData : row)));
        setSuccessMessage('Entry updated successfully!');
        calculateTotals(data.map((row) => (row.id === updatedData.id ? updatedData : row)));
        
        // Log to confirm the update
        console.log("Update successful:", response.data);
      }
    } catch (error) {
      // Log any error that occurs
      console.error('Error updating data', error);
    }
  };
  
  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/entries/${id}`);
      setData((prevData) => prevData.filter((row) => row.id !== id));
      setDeleteSuccessMessage('Entry deleted successfully!');
      calculateTotals(data.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  const handleDownload = (row) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setFont("Times-Roman", "bold");

    const lineHeight = 10;
    const startX = 10;
    let currentY = 10;

    const addTextWithLabel = (label, value, yPosition) => {
      doc.text(label, startX, yPosition);
      doc.setFont("Times-Roman", "normal");
      doc.text(String(value), startX + 50, yPosition);
      doc.setFont("Times-Roman", "bold");
    };

    addTextWithLabel("ID:", row.id ? String(row.id) : 'N/A', currentY);
    currentY += lineHeight;
    addTextWithLabel("Date:", row.date ? String(row.date.split(", ")[0]) : "N/A", currentY);
    currentY += lineHeight;
    addTextWithLabel("Time:", row.date ? (row.date.split(", ")[1] ? String(row.date.split(", ")[1]) : "N/A") : "N/A", currentY);
    currentY += lineHeight;
    addTextWithLabel("Category:", row.category ? String(row.category) : 'N/A', currentY);
    currentY += lineHeight;
    addTextWithLabel("Note:", row.note ? String(row.note) : 'N/A', currentY);
    currentY += lineHeight;
    addTextWithLabel("Expense:", row.expense ? String(row.expense) : "-", currentY);
    currentY += lineHeight;
    addTextWithLabel("Income:", row.income ? String(row.income) : "-", currentY);
    currentY += lineHeight;
    addTextWithLabel("Amount:", `${row.currency === "USD" ? "$" : "₹"} ${row.amount ? String(row.amount) : '0'}`, currentY);

    doc.save(`entry-${row.id}.pdf`);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
    setEditRow(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditRow(null);
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setShowPopup(true);
  };

  const handleView = (row) => {
    setViewRow(row);
  };

  const handleCloseView = () => {
    setViewRow(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteEntry(deleteId);
    }
    setConfirmDelete(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setDeleteId(null);
  };

  const handleRowClick = (id) => {
    setSelectedRowId(id);
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };

  const calculateTotals = (filteredData) => {
    const totalIncome = filteredData.reduce((sum, row) => {
      const incomeStr = row.income?.trim();
      const income = parseFloat(incomeStr.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(income) && incomeStr !== '-' && income > 0) {
        return sum + income;
      }
      return sum;
    }, 0);

    const totalExpense = filteredData.reduce((sum, row) => {
      const expenseStr = row.expense?.trim();
      const expense = parseFloat(expenseStr.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(expense) && expenseStr !== '-' && expense > 0) {
        return sum + expense;
      }
      return sum;
    }, 0);

    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
  };

  const handleSortChange = async (e) => {
    const criteria = e.target.value;
    setSortCriteria(criteria);

    try {
      const response = await axios.get('http://localhost:3000/api/entries');
      if (response.status === 200) {
        let sortedData = [...response.data];
        const now = new Date();

        if (criteria === 'today') {
          sortedData = sortedData.filter((row) => {
            const rowDate = new Date(row.date.split(', ')[0]);
            return rowDate.getDate() === now.getDate() && rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
          });
        } else if (criteria === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          sortedData = sortedData.filter((row) => {
            const rowDate = new Date(row.date.split(', ')[0]);
            return rowDate.getDate() === yesterday.getDate() && rowDate.getMonth() === yesterday.getMonth() && rowDate.getFullYear() === yesterday.getFullYear();
          });
        } else if (criteria === 'last7days') {
          sortedData = sortedData.filter((row) => {
            const rowDate = new Date(row.date.split(', ')[0]);
            const diffTime = now - rowDate;
            return diffTime <= 7 * 24 * 60 * 60 * 1000;
          });
        } else if (criteria === 'last1month') {
          sortedData = sortedData.filter((row) => {
            const rowDate = new Date(row.date.split(', ')[0]);
            const diffTime = now - rowDate;
            return diffTime <= 30 * 24 * 60 * 60 * 1000;
          });
        } else if (criteria === 'last1year') {
          sortedData = sortedData.filter((row) => {
            const rowDate = new Date(row.date.split(', ')[0]);
            const diffTime = now - rowDate;
            return diffTime <= 365 * 24 * 60 * 60 * 1000;
          });
        } else if (criteria === 'all') {
          sortedData = [...response.data];
        }

        calculateTotals(sortedData);
        setData(sortedData);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data', error.message);
    }
  };

  const handleDownloadSortedData = () => {
    if (data.length === 0) {
      console.error('No data available to download.');
      return;
    }

    const headers = ['ID', 'Date', 'Time', 'Category', 'Note', 'Expense', 'Income', 'Amount'];
    const csvRows = data.map(row => [
      row.id !== undefined ? String(row.id) : 'N/A',
      row.date ? row.date.split(', ')[0] : 'N/A',
      row.date ? (row.date.split(', ')[1] ? String(row.date.split(', ')[1]) : "N/A") : "N/A",
      row.category ? String(row.category) : '-',
      row.note ? String(row.note) : '-',
      row.expense ? String(row.expense) : '-',
      row.income ? String(row.income) : '-',
      `${row.currency === 'USD' ? '$' : '₹'} ${row.amount ? String(row.amount) : '0'}`
    ]);

    const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
    const csvWithBom = "\uFEFF" + csvContent;

    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sorted_data_${sortCriteria || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((row) =>
    (row.id !== undefined && row.id.toString().includes(searchQuery)) ||
    (row.category && row.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (row.note && row.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="TableContainer">
      <div className="Header">
        <h3>Money Tracker</h3>
      </div>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <Card sx={{
          width: 180, height: 100, padding: 1, borderRadius: '12px', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', color: 'white',
        }}>
          <CardContent>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} gutterBottom>Total Income</Typography>
            <Typography variant="h6">₹ {totalIncome.toLocaleString()}</Typography>
          </CardContent>
        </Card>

        <Card sx={{
          width: 180, height: 100, padding: 1, borderRadius: '12px', background: 'linear-gradient(135deg, #ff9a9e 0%, #ff6a88 100%)', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', color: 'white',
        }}>
          <CardContent>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} gutterBottom>Total Expense</Typography>
            <Typography variant="h6">₹ {totalExpense.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
  <TextField
    value={searchQuery}
    onChange={handleSearch}
    placeholder="Search"
    variant="outlined"
    size="small"
    sx={{
      marginRight: '4px',
      backgroundColor: 'background.paper', // Material-UI's theme-based background color
      color: 'text.primary', // Adjust text color based on the theme
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'text.primary', // Border color adapts to theme
        },
        '&:hover fieldset': {
          borderColor: 'primary.main', // Primary color for hover
        },
        '&.Mui-focused fieldset': {
          borderColor: 'primary.main', // Primary color when focused
        },
      },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />



        <select value={sortCriteria} onChange={handleSortChange} className="SortBox" style={{ marginRight: '10px' }}>
          <option value="">Sort By</option>
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last1month">Last 1 Month</option>
          <option value="last1year">Last 1 Year</option>
        </select>

        <Button variant="contained" color="secondary" onClick={handleDownloadSortedData} style={{ marginRight: '10px' }}>Download</Button>
        <Button variant="contained" color="primary" onClick={handleOpenPopup} className="AddNewEntryButton">Add New Entry</Button>
      </div>

      <div className="TableHeader">
        <MuiTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '100px', padding: '8px', borderRight: '1px solid #ddd' }}>ID</TableCell>
              <TableCell align="right" sx={{ padding: '8px', borderRight: '1px solid #ddd' }}>DATE</TableCell>
             
              <TableCell align="right" sx={{ padding: '8px', borderRight: '1px solid #ddd' }}>CATEGORY</TableCell>
              <TableCell align="right" sx={{ padding: '8px', borderRight: '1px solid #ddd' }}>NOTE</TableCell>
              <TableCell align="right" sx={{ padding: '8px', borderRight: '1px solid #ddd' }}>EXPENSE</TableCell>
              <TableCell align="right" sx={{ padding: '8px', borderRight: '1px solid #ddd' }}>INCOME</TableCell>
              <TableCell align="right" sx={{ padding: '8px', borderRight: '1px solid #ddd' }}>AMOUNT</TableCell>
              <TableCell align="" sx={{ padding: '8px', borderRight: 'none' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
        </MuiTable>
      </div>

      <div className="TableBodyContainer">
        <TableContainer component={Paper}>
          <MuiTable>
            <TableBody>
              {filteredData.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layoutId={row.id.toString()}
                  ref={selectedRowId === row.id ? newRowRef : null}
                  className={selectedRowId === row.id ? 'selected-row' : ''}
                  onClick={() => handleRowClick(row.id)}
                >
                  <TableCell component="th" scope="row">{row.id}</TableCell>
                  <TableCell align="left">{row.date ? row.date.split(', ')[0] : 'N/A'}</TableCell>
                
                  <TableCell align="left">{row.category}</TableCell>
                  <TableCell align="left">{row.note}</TableCell>
                  <TableCell align="left">{row.expense ? row.expense : '-'}</TableCell>
                  <TableCell align="left">{row.income ? row.income : '-'}</TableCell>
                  <TableCell align="left">{row.currency === 'USD' ? '$' : '₹'} {row.amount}</TableCell>
                  <TableCell align="left">
                    <IconButton color="info" size="small" style={{ marginRight: 8 }} onClick={() => handleView(row)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" size="small" style={{ marginRight: 8 }} onClick={() => handleEdit(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" size="small" style={{ marginRight: 8 }} onClick={() => handleDownload(row)}>
                      <GetAppIcon />
                    </IconButton>
                    <IconButton color="secondary" size="small" onClick={() => handleDeleteClick(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </div>

      {showPopup && (
        <Popup
          show={showPopup}
          handleClose={handleClosePopup}
          addData={editRow ? updateEntry : addEntry}
          editRow={editRow}
        />
      )}

      {viewRow && (
        <Dialog
          open={Boolean(viewRow)}
          onClose={handleCloseView}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              backgroundImage: 'linear-gradient(135deg, #e0f7fa, #ffebee)',
            },
          }}
        >
          <DialogTitle style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: '#ff6f61',
            textAlign: 'center',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}>
            View Entry
          </DialogTitle>
          <DialogContent style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            fontSize: '1.3rem',
            color: '#555',
            padding: '0 20px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '8px 0', color: '#00796b' }}>ID:</td>
                  <td style={{ padding: '8px 0', color: '#00796b' }}>{viewRow.id}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '8px 0', color: '#00796b' }}>Date:</td>
                  <td style={{ padding: '8px 0', color: '#00796b' }}>{viewRow?.date ? viewRow.date.split(', ')[0] : 'N/A'}</td>
                </tr>
               
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '8px 0', color: '#00796b' }}>Category:</td>
                  <td style={{ padding: '8px 0', color: '#00796b' }}>{viewRow.category}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '8px 0', color: '#00796b' }}>Note:</td>
                  <td style={{ padding: '8px 0', color: '#00796b' }}>{viewRow.note ? viewRow.note : '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '8px 0', color: '#00796b' }}>Expense:</td>
                  <td style={{ padding: '8px 0', color: '#00796b' }}>{viewRow.expense ? viewRow.expense : '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '8px 0', color: '#00796b' }}>Income:</td>
                  <td style={{ padding: '8px 0', color: '#00796b' }}>{viewRow.income ? viewRow.income : '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '8px 0', color: '#00796b' }}>Amount:</td>
                  <td style={{ padding: '8px 0', color: '#00796b' }}>{viewRow.currency === 'USD' ? '$' : '₹'} {viewRow.amount}</td>
                </tr>
              </tbody>
            </table>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center', paddingTop: '20px' }}>
            <Button onClick={handleCloseView} variant="contained" style={{
              backgroundColor: '#00796b',
              color: 'white',
              borderRadius: '20px',
              padding: '10px 20px',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              fontWeight: 'bold',
            }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={confirmDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this entry?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} onClose={handleCloseSuccessMessage}>
        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
      </Snackbar>

      <Snackbar open={Boolean(deleteSuccessMessage)} autoHideDuration={3000} onClose={() => setDeleteSuccessMessage('')}>
        <Alert onClose={() => setDeleteSuccessMessage('')} severity="success" sx={{ width: '100%' }}>{deleteSuccessMessage}</Alert>
      </Snackbar>
    </div>
  );
}