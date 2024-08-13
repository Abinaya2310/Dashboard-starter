import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/entries');
      if (response.status === 200) {
        // Sort the data by date and time in descending order (newest first)
        const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(sortedData);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data', error.message);
    }
  };

  const addEntry = async (newData) => {
    try {
      // Get the current date and time in IST
      const currentISTDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const newDataWithTime = { ...newData, date: currentISTDateTime };
      const response = await axios.post('http://localhost:3000/api/entries', newDataWithTime);
      setData((prevData) => [response.data, ...prevData]);
    } catch (error) {
      console.error('Error adding data', error);
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

  return (
    <div className="TableContainer">
      <div className="Header">
        <h3>Money Tracker</h3>
        <Button variant="contained" color="primary" onClick={handleOpenPopup}>
          Add New Entry
        </Button>
      </div>
      <TableContainer
        component={Paper}
        style={{ maxHeight: 400, overflowY: 'auto', boxShadow: '0px 13px 20px 0px #80808029' }}
      >
        <LayoutGroup>
          <AnimatePresence>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">DATE</TableCell>
                  <TableCell align="left">TIME</TableCell> {/* Added TIME header */}
                  <TableCell align="left">CATEGORY</TableCell>
                  <TableCell align="left">EXPENSE</TableCell>
                  <TableCell align="left">INCOME</TableCell>
                  <TableCell align="left">AMOUNT</TableCell>
                  <TableCell align="left">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layoutId={row.id.toString()}
                    className={selectedRowId === row.id ? 'selected-row' : ''}
                    onClick={() => handleRowClick(row.id)}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">
                      {row.date ? row.date.split(', ')[0] : 'N/A'} {/* Safely check if date exists */}
                    </TableCell>
                    <TableCell align="left">
                      {row.date ? (row.date.split(', ')[1] ? row.date.split(', ')[1] : 'N/A') : 'N/A'} {/* Safely check if time exists */}
                    </TableCell>
                    <TableCell align="left">{row.category}</TableCell>
                    <TableCell align="left">
                      {row.expense ? row.expense : '-'} {/* Show expense if available, otherwise '-' */}
                    </TableCell>
                    <TableCell align="left">
                      {row.income ? row.income : '-'} {/* Show income if available, otherwise '-' */}
                    </TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="left">
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
          </AnimatePresence>
        </LayoutGroup>
      </TableContainer>

      {showPopup && (
        <Popup
          show={showPopup}
          handleClose={handleClosePopup}
          addData={addEntry}
          editRow={editRow}
        />
      )}

      {/* View Modal */}
      {viewRow && (
        <Dialog open={Boolean(viewRow)} onClose={handleCloseView}>
          <DialogTitle>View Entry</DialogTitle>
          <DialogContent>
            <p>
              <strong>ID:</strong> {viewRow.id}
            </p>
            <p>
              <strong>Date:</strong> {viewRow.date ? viewRow.date.split(', ')[0] : 'N/A'}</p> {/* Safely check if date exists */}
            <p>
              <strong>Time:</strong> {viewRow.date ? (viewRow.date.split(', ')[1] ? viewRow.date.split(', ')[1] : 'N/A') : 'N/A'}</p> {/* Safely check if time exists */}
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

      {/* Delete Confirmation Dialog */}
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
    </div>
  );
}
