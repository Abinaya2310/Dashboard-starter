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
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import './Table.css';

function createData(id, date, expense, income, file, amount) {
  return { id, date, expense, income, file, amount };
}

const initialRows = [
  createData(18908424, '1 March 2024', '7899', 10000,  500),
  createData(18908425, '2 March 2024', '76889', 20890,  1500),
  createData(18908426, '2 March 2024', '2346', 50,  300),
  createData(18908427, '2 March 2024', '780', 30078, 200),
  createData(18908428, '3 March 2024', '467', 7099, 400),
  createData(18908429, '4 March 2024', '7899', 40, 250),
  createData(18908430, '5 March 2024', '3455', 120, 800),
  createData(18908431, '6 March 2024', '2000', 90, 600),
];

export default function BasicTable() {
  const [data, setData] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

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
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <div className="Table">
      <h3>Money Tracker</h3>
      <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto', boxShadow: '0px 13px 20px 0px #80808029' }}>
        <AnimatePresence>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">DATE</TableCell>
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
                  <TableCell align="left">{row.expense}</TableCell>
                  <TableCell align="left">{row.income}</TableCell>
                 
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
    </div>
  );
}

