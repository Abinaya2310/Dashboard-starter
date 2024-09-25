import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AuditTable = () => {
  const [entries, setEntries] = useState([]); // State to store the audit records
  const [page, setPage] = useState(0); // State to manage the current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // State to manage the number of rows per page

  // Fetch data from MongoDB (AuditRecords) when the component is mounted
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auditrecords'); // Adjust the URL if necessary
      if (response.status === 200) {
        setEntries(response.data); // Update the entries state with the fetched data
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  // Helper function to convert JSON data to CSV format
  const convertToCSV = (auditrecords) => {
    const header = ['ID', 'Date', 'Category', 'Type', 'Amount', 'Note', 'Audit Entry']; // CSV headers
    const rows = auditrecords.map(entry => [
      entry.id,
      entry.date,
      entry.category,
      entry.type,
      entry.amount,
      entry.note,
      entry.sentence
    ]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  };

  // Function to trigger CSV download
  const downloadCSV = (auditrecords) => {
    const csv = convertToCSV(auditrecords);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'audit_log.csv');
    a.click();
  };

  // Handle page changes in the table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle changes in the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ position: 'relative', marginTop: '100px' }}>
      {/* Button to download the audit log as CSV */}
      <Button
        variant="contained"
        onClick={() => downloadCSV(entries)}
        sx={{
          position: 'absolute',
          top: '30px',
          right: '20px',
          color: 'white',
          backgroundColor: 'black'
        }}
      >
        Download Audit Log
      </Button>

      {/* Table container for displaying the audit log entries */}
      <TableContainer
        component={Paper}
        sx={{ marginTop: '80px', border: '1px solid #ccc', borderRadius: '8px', width: '95%', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="audit table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Category</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Amount</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Note</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Audit Entry</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => (
              <TableRow key={entry._id}>
                <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.id}</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.date}</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.category}</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.type}</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.amount}</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.note}</TableCell>
                <TableCell align="center">{entry.sentence}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* TablePagination component to manage pagination */}
        <TablePagination
          component="div"
          count={entries.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </TableContainer>
    </div>
  );
};

export default AuditTable;

