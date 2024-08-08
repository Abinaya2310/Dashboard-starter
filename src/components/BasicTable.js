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
import TextField from '@mui/material/TextField';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useState } from 'react';
import Popup from './Popup'; // Ensure the correct import path
import './Table.css';

function createData(id, date, expense, income, file, amount) {
  return { id, date, expense, income, file, amount };
}

const initialRows = [
  createData(18908424, '2 March 2022', 'Lasania Chicken Fri', 100, 'file1.pdf', 500),
  createData(18908425, '2 March 2022', 'Big Baza Bang', 200, 'file2.pdf', 1500),
  createData(18908426, '2 March 2022', 'Mouth Freshener', 50, 'file3.pdf', 300),
  createData(18908427, '2 March 2022', 'Cupcake', 30, 'file4.pdf', 200),
  createData(18908424, '2 March 2022', 'Lasania Chicken Fri', 100, 'file1.pdf', 500),
  createData(18908425, '2 March 2022', 'Big Baza Bang', 200, 'file2.pdf', 1500),
  createData(18908426, '2 March 2022', 'Mouth Freshener', 50, 'file3.pdf', 300),
  createData(18908427, '2 March 2022', 'Cupcake', 30, 'file4.pdf', 200),
];

export default function BasicTable() {
  const [data, setData] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClickOpen = (row) => {
    setEditRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRow(null);
  };

  const handleSave = () => {
    const newData = data.map((item) =>
      item.id === editRow.id ? editRow : item
    );
    setData(newData);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditRow({ ...editRow, [name]: value });
  };

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleAddData = (newData) => {
    setData((prevData) => [...prevData, newData]);
  };

  return (
    <div className="Table">
      <h3>Money Tracker</h3>
      <Button variant="contained" color="primary" onClick={() => setShowPopup(true)}>
        Add Entry
      </Button>
      <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto', boxShadow: '0px 13px 20px 0px #80808029' }}>
        <LayoutGroup>
          <AnimatePresence>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">DATE</TableCell>
                  <TableCell align="left">EXPENSE</TableCell>
                  <TableCell align="left">INCOME</TableCell>
                  <TableCell align="left">FILE</TableCell>
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
                    <TableCell align="left">{row.expense}</TableCell>
                    <TableCell align="left">{row.income}</TableCell>
                    <TableCell align="left">{row.file}</TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={() => handleClickOpen(row)}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            type="text"
            fullWidth
            variant="standard"
            name="date"
            value={editRow?.date || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Expense"
            type="text"
            fullWidth
            variant="standard"
            name="expense"
            value={editRow?.expense || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Income"
            type="text"
            fullWidth
            variant="standard"
            name="income"
            value={editRow?.income || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="File"
            type="text"
            fullWidth
            variant="standard"
            name="file"
            value={editRow?.file || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="standard"
            name="amount"
            value={editRow?.amount || ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Popup
        show={showPopup}
        handleClose={() => setShowPopup(false)}
        addData={handleAddData}
      />
    </div>
  );
}

