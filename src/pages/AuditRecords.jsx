import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AuditTable = () => {
  const [auditRecords, setAuditRecords] = useState([]); // Define the auditRecords state
  const [entries, setEntries] = useState([]); // State to store the table data (AuditRecords)
  const [page, setPage] = useState(0); // State to manage the current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // State to manage the number of rows per page

  // Fetch data from MongoDB (AuditRecords) when the component is mounted
  useEffect(() => {
    const fetchAuditRecords = async () => {
      try {
        const response = await axios.get('/api/auditrecords'); // Make a GET request to your AuditRecord API endpoint
        setAuditRecords(response.data); // Store the fetched data in the auditRecords state
        setEntries(response.data); // Update the entries state with the fetched data
      } catch (error) {
        console.error("Error fetching audit records:", error); // Log any errors during data fetching
      }
    };

    fetchAuditRecords(); // Call the fetch function
  }, []); // Empty dependency array means this runs once when the component mounts

  // Helper function to convert JSON data to CSV format
  const convertToCSV = (auditrecords) => {
    const header = ['ID', 'Date', 'Category', 'Type', 'Amount', 'Note', 'Audit Entry']; // CSV headers
    const rows = auditrecords.map(entry => [ // Fixing the reference to auditrecords
      entry.id, // Using `id` from the `AuditRecord`
      entry.date, // Date of the audit entry
      entry.category, // Category related to the entry
      entry.type, // Income or Expense type
      entry.amount, // Amount of the entry
      entry.note, // Note attached to the entry
      entry.sentence // Generated sentence (Audit Entry)
    ]);

    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n'); // Join rows and headers into CSV format
    return csvContent; // Return the CSV string
  };

  // Function to trigger CSV download
  const downloadCSV = (auditrecords) => {
    const csv = convertToCSV(auditrecords); // Generate CSV content from audit records
    const blob = new Blob([csv], { type: 'text/csv' }); // Create a blob object from the CSV content
    const url = window.URL.createObjectURL(blob); // Create a downloadable URL for the CSV blob
    const a = document.createElement('a'); // Create a temporary link element
    a.setAttribute('href', url); // Set the href attribute to the blob URL
    a.setAttribute('download', 'audit_log.csv'); // Set the download attribute for the file name
    a.click(); // Programmatically click the link to trigger the download
  };

  // Handle page changes in the table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Update the page state with the new page number
  };

  // Handle changes in the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page state
    setPage(0); // Reset to the first page after changing the rows per page
  };

  return (
    <div style={{ position: 'relative', marginTop: '100px' }}>
      {/* Button to download the audit log as CSV */}
      <Button
        variant="contained"
        onClick={() => downloadCSV(entries)} // Trigger the downloadCSV function when clicked
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
        sx={{ marginTop: '80px', border: '1px solid #ccc', borderRadius: '8px', width: '95%', marginLeft: 'auto', marginRight: 'auto' }} // Slightly bigger table width
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
              <React.Fragment key={entry._id}>
                {/* Render a row for each audit record */}
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: '1px solid #ccc' }}>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.id}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.date}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.category}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.type}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.amount}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.note}</TableCell>
                  <TableCell align="center">{entry.sentence}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {/* TablePagination component to manage pagination */}
        <TablePagination
          component="div"
          count={entries.length} // Total number of entries
          page={page} // Current page
          onPageChange={handleChangePage} // Function to change page
          rowsPerPage={rowsPerPage} // Rows per page
          onRowsPerPageChange={handleChangeRowsPerPage} // Function to change rows per page
          rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        />
      </TableContainer>
    </div>
  );
};

export default AuditTable;
