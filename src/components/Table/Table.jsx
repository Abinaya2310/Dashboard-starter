import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
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
import { jsPDF } from 'jspdf';
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
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');

  const newRowRef = useRef(null);

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
      setDeleteSuccessMessage('Entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  const handleDownload = (row) => {
    const doc = new jsPDF();

    const lineHeight = 10;
    const startX = 10;
    let currentY = 10;

    doc.text(`ID:`, startX, currentY);
    doc.text(`${row.id}`, startX + 50, currentY);

    currentY += lineHeight;
    doc.text(`Date:`, startX, currentY);
    doc.text(`${row.date ? row.date.split(', ')[0] : 'N/A'}`, startX + 50, currentY);

    currentY += lineHeight;
    doc.text(`Time:`, startX, currentY);
    doc.text(`${row.date ? (row.date.split(', ')[1] ? row.date.split(', ')[1] : 'N/A') : 'N/A'}`, startX + 50, currentY);

    currentY += lineHeight;
    doc.text(`Category:`, startX, currentY);
    doc.text(`${row.category}`, startX + 50, currentY);

    currentY += lineHeight;
    doc.text(`Note:`, startX, currentY);
    doc.text(`${row.note}`, startX + 50, currentY);

    currentY += lineHeight;
    doc.text(`Expense:`, startX, currentY);
    doc.text(`${row.expense ? row.expense : '-'}`, startX + 50, currentY);

    currentY += lineHeight;
    doc.text(`Income:`, startX, currentY);
    doc.text(`${row.income ? row.income : '-'}`, startX + 50, currentY);

    currentY += lineHeight;
    doc.text(`Amount:`, startX, currentY);
    doc.text(`${row.currency === 'USD' ? '$' : '₹'} ${row.amount}`, startX + 50, currentY);

    doc.save(`entry-${row.id}.pdf`);
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
            return (
              rowDate.getDate() === now.getDate() &&
              rowDate.getMonth() === now.getMonth() &&
              rowDate.getFullYear() === now.getFullYear()
            );
          });
        } else if (criteria === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);

          sortedData = sortedData.filter((row) => {
            const rowDate = new Date(row.date.split(', ')[0]);
            return (
              rowDate.getDate() === yesterday.getDate() &&
              rowDate.getMonth() === yesterday.getMonth() &&
              rowDate.getFullYear() === yesterday.getFullYear()
            );
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

        setData(sortedData);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data', error.message);
    }
  };

  return (
    <div className="TableContainer">
      <div className="Header">
        <h3>Money Tracker</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select value={sortCriteria} onChange={handleSortChange} className="SortBox" style={{ marginRight: '10px' }}>
            <option value="">Sort By</option>
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last1month">Last 1 Month</option>
            <option value="last1year">Last 1 Year</option>
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
              <TableCell sx={{ width: '100px', padding: '8px', borderRight: '1px solid #ddd' }}>ID</TableCell>
              <TableCell align="right" sx={{ width: '90px', padding: '8px', borderRight: '1px solid #ddd' }}>DATE</TableCell>
              <TableCell align="right" sx={{ width: '150px', padding: '8px', borderRight: '1px solid #ddd' }}>TIME</TableCell>
              <TableCell align="right" sx={{ width: '150px', padding: '8px', borderRight: '1px solid #ddd' }}>CATEGORY</TableCell>
              <TableCell align="right" sx={{ width: '100px', padding: '8px', borderRight: '1px solid #ddd' }}>NOTE</TableCell>
              <TableCell align="right" sx={{ width: '120px', padding: '8px', borderRight: '1px solid #ddd' }}>EXPENSE</TableCell>
              <TableCell align="right" sx={{ width: '120px', padding: '8px', borderRight: '1px solid #ddd' }}>INCOME</TableCell>
              <TableCell align="right" sx={{ width: '120px', padding: '8px', borderRight: '1px solid #ddd' }}>AMOUNT</TableCell>
              <TableCell align="right" sx={{ width: '150px', padding: '8px', borderRight: 'none' }} className="actions-header">ACTIONS</TableCell>
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
                  ref={selectedRowId === row.id ? newRowRef : null}
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
                  <TableCell align="left">{row.note}</TableCell> {/* Display the note */}
                  <TableCell align="left">
                    {row.expense ? row.expense : '-'}
                  </TableCell>
                  <TableCell align="left">
                    {row.income ? row.income : '-'}
                  </TableCell>
                  <TableCell align="left">
                    {row.currency === 'USD' ? '$' : '₹'} {row.amount}
                  </TableCell>
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
                      style={{ marginRight: 8 }}
                      onClick={() => handleDownload(row)}
                    >
                      <GetAppIcon />
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
          addData={editRow ? updateEntry : addEntry}
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
              <strong>Date:</strong> {viewRow?.date ? viewRow.date.split(', ')[0] : 'N/A'}
            </p>
            <p>
              <strong>Time:</strong> {viewRow?.date ? (viewRow.date.split(', ')[1] ? viewRow.date.split(', ')[1] : 'N/A') : 'N/A'}
            </p>
            <p>
              <strong>Category:</strong> {viewRow.category}
            </p>
            <p>
              <strong>Note:</strong> {viewRow.note ? viewRow.note : '-'}
            </p>
            <p>
              <strong>Expense:</strong> {viewRow.expense ? viewRow.expense : '-'}
            </p>
            <p>
              <strong>Income:</strong> {viewRow.income ? viewRow.income : '-'}
            </p>
            <p>
              <strong>Amount:</strong> {viewRow.currency === 'USD' ? '$' : '₹'} {viewRow.amount}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseView} color="primary">
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

      <Snackbar open={Boolean(deleteSuccessMessage)} autoHideDuration={3000} onClose={() => setDeleteSuccessMessage('')}>
        <Alert onClose={() => setDeleteSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {deleteSuccessMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
