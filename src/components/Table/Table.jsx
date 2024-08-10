import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useState } from 'react';
import Popup from '../Popup/Popup';
import './Table.css';

function createData(id, date, category, expense, income, amount) {
  return { id, date, category, expense, income, amount };
}

const initialRows = [
  createData(18908424, '2 March 2022', 'Food', 'Lasania Chicken Fri', '', '₹500'),
  createData(18908425, '2 March 2022', 'Shopping', 'Big Baza Bang', '', '₹1500'),
  createData(18908426, '2 March 2022', 'Health', 'Mouth Freshener', '', '₹300'),
  createData(18908427, '2 March 2022', 'Food', 'Cupcake', '', '₹200'),
  createData(18908428, '3 March 2022', 'Food', 'Pizza', '', '₹1000'),
  createData(18908429, '4 March 2022', 'Food', 'Burger', '', '₹400'),
  createData(18908430, '5 March 2022', 'Food', 'Pasta', '', '₹600'),
  createData(18908431, '6 March 2022', 'Food', 'Ice Cream', '', '₹250'),
];

export default function BasicTable() {
  const [data, setData] = useState(initialRows);
  const [showPopup, setShowPopup] = useState(false);
  const [editRow, setEditRow] = useState(null); // State to handle editing
  const [viewRow, setViewRow] = useState(null); // State to handle viewing

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditRow(null); // Reset editRow when closing the popup
  };

  const addData = (newData) => {
    if (editRow) {
      // Editing existing row
      setData((prevData) =>
        prevData.map((row) => (row.id === editRow.id ? newData : row))
      );
    } else {
      // Adding new row
      setData((prevData) => [...prevData, newData]);
    }
    setShowPopup(false);
  };

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
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
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="left">{row.category}</TableCell>
                    <TableCell align="left">{row.expense}</TableCell>
                    <TableCell align="left">{row.income}</TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={() => handleView(row)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </Button>
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
          addData={addData}
          editRow={editRow} // Pass the row to edit if applicable
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
              <strong>Date:</strong> {viewRow.date}
            </p>
            <p>
              <strong>Category:</strong> {viewRow.category}
            </p>
            <p>
              <strong>Expense:</strong> {viewRow.expense || 'N/A'}
            </p>
            <p>
              <strong>Income:</strong> {viewRow.income || 'N/A'}
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
    </div>
  );
}









