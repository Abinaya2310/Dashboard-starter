import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import Popup from '../Popup/Popup';
import './Table.css';

export default function BasicTable() {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [viewRow, setViewRow] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [sortCriteria, setSortCriteria] = useState(''); // State for sorting criteria

  const newRowRef = useRef(null); // Ref for the newly added row

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/entries');
      if (response.status === 200) {
        setData(response.data);
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
      const newDataWithTime = { ...newData, date: currentISTDateTime };
      const response = await axios.post('http://localhost:3000/api/entries', newDataWithTime);
      setData((prevData) => [response.data, ...prevData]);
      setSelectedRowId(response.data.id); // Set the new entry as selected

      // Scroll to the newly added row
      setTimeout(() => {
        if (newRowRef.current) {
          newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100); // Delay to ensure the row is added before scrolling

      setSuccessMessage('Entry added successfully!');
    } catch (error) {
      console.error('Error adding data', error);
    }
  };

  const updateEntry = async (updatedData) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/entries/${updatedData.id}`, updatedData);
      if (response.status === 200) {
        setData((prevData) => prevData.map((row) => (row.id === updatedData.id ? updatedData : row)));
        setSuccessMessage('Entry updated successfully!');
      }
    } catch (error) {
      console.error('Error updating data', error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/entries/${id}`);
      setData((prevData) => prevData.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
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

  // Sort the data based on the selected criteria
  const handleSortChange = (e) => {
    const criteria = e.target.value;
    setSortCriteria(criteria);

    let sortedData = [...data];
    if (criteria === 'id') {
      sortedData.sort((a, b) => a.id.localeCompare(b.id));
    } else if (criteria === 'date') {
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (criteria === 'time') {
      sortedData.sort((a, b) => new Date('1970/01/01 ' + a.date.split(', ')[1]) - new Date('1970/01/01 ' + b.date.split(', ')[1]));
    } else if (criteria === 'category') {
      sortedData.sort((a, b) => a.category.localeCompare(b.category));
    } else if (criteria === 'expense') {
      sortedData.sort((a, b) => (a.expense || 0) - (b.expense || 0));
    } else if (criteria === 'income') {
      sortedData.sort((a, b) => (a.income || 0) - (b.income || 0));
    } else if (criteria === 'amount') {
      sortedData.sort((a, b) => a.amount - b.amount);
    }

    setData(sortedData);
  };

  return (
    <div className="TableContainer">
      <div className="Header">
        <h3>Money Tracker</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select value={sortCriteria} onChange={handleSortChange} className="SortBox" style={{ marginRight: '10px' }}>
            <option value="">Sort By</option>
            <option value="id">ID</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
            <option value="category">Category</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="amount">Amount</option>
          </select>
          <Button variant="contained" color="primary" onClick={handleOpenPopup} className="AddNewEntryButton">
            Add New Entry
          </Button>
        </div>
      </div>
      <div className="TableHeader">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">DATE</TableCell>
              <TableCell align="left">TIME</TableCell>
              <TableCell align="left">CATEGORY</TableCell>
              <TableCell align="left">EXPENSE</TableCell>
              <TableCell align="left">INCOME</TableCell>
              <TableCell align="left">AMOUNT</TableCell>
              <TableCell align="left" className="actions-header">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </div>
      <div className="TableBodyContainer">
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {data.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layoutId={row.id.toString()}
                  ref={selectedRowId === row.id ? newRowRef : null} // Assign ref to the new row
                  className={selectedRowId === row.id ? 'selected-row' : ''}
                  onClick={() => handleRowClick(row.id)}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">
                    {row.date ? row.date.split(', ')[0] : 'N/A'}
                  </TableCell>
                  <TableCell align="left">
                    {row.date ? (row.date.split(', ')[1] ? row.date.split(', ')[1] : 'N/A') : 'N/A'}
                  </TableCell>
                  <TableCell align="left">{row.category}</TableCell>
                  <TableCell align="left">
                    {row.expense ? row.expense : '-'}
                  </TableCell>
                  <TableCell align="left">
                    {row.income ? row.income : '-'}
                  </TableCell>
                  <TableCell align="left">{row.amount}</TableCell>
                  <TableCell align="left" className="actions-cell">
                    <IconButton
                      color="info"
                      size="small"
                      style={{ marginRight: 8 }}
                      onClick={() => handleView(row)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      size="small"
                      style={{ marginRight: 8 }}
                      onClick={() => handleEdit(row)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteClick(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {showPopup && (
        <Popup
          show={showPopup}
          handleClose={handleClosePopup}
          addData={editRow ? updateEntry : addEntry}  // Use updateEntry if editing
          editRow={editRow}
        />
      )}

      {viewRow && (
        <Dialog open={Boolean(viewRow)} onClose={handleCloseView}>
          <DialogTitle>View Entry</DialogTitle>
          <DialogContent>
            <p>
              <strong>ID:</strong> {viewRow.id}
            </p>
            <p>
              <strong>Date:</strong> {viewRow.date ? viewRow.date.split(', ')[0] : 'N/A'}
            </p>
            <p>
              <strong>Time:</strong> {viewRow.date ? (viewRow.date.split(', ')[1] ? viewRow.date.split(', ')[1] : 'N/A') : 'N/A'}
            </p>
            <p>
              <strong>Category:</strong> {viewRow.category}
            </p>
            <p>
              <strong>Expense:</strong> {viewRow.expense ? viewRow.expense : '-'}
            </p>
            <p>
              <strong>Income:</strong> {viewRow.income ? viewRow.income : '-'}
            </p>
            <p>
              <strong>Amount:</strong> {viewRow.amount}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseView} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={confirmDelete}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this entry?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} onClose={handleCloseSuccessMessage}>
        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}



