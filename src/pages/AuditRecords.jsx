import { Search } from '@mui/icons-material'; // Import the Search icon
import { Box, Button, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AuditTable = () => {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showColoredEntries, setShowColoredEntries] = useState(false); // Toggle state for colored entries

  const theme = useTheme(); // Access theme properties to adapt to light and dark modes

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auditrecords');
      if (response.status === 200) {
        const entriesWithStatus = response.data.map((entry, index) => ({
          ...entry,
          // Assign a status based on the index only if the backend doesn't provide it
          status: entry.status || (index % 3 === 0 ? 'added' : index % 3 === 1 ? 'updated' : 'deleted')
        }));
        
        console.log('Fetched entries with status:', entriesWithStatus); // Log to verify
        setEntries(entriesWithStatus);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  
  
  

  const convertToCSV = (auditrecords) => {
    const header = ['ID', 'Date', 'Category', 'Type', 'Amount', 'Note', 'Audit Entry'];
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

  const downloadCSV = (auditrecords) => {
    const csv = convertToCSV(auditrecords);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'audit_log.csv');
    a.click();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log('Changed page to:', newPage); // Log when the page changes
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    console.log('Rows per page changed to:', event.target.value); // Log the change in rows per page
  };

  const handleToggleChange = () => {
    setShowColoredEntries(!showColoredEntries);
    console.log('Toggle switched to:', !showColoredEntries); // Log the toggle state change
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
    console.log('Search query:', event.target.value); // Log the search query input
  };

  const filteredEntries = entries.filter(entry =>
    (entry.id && entry.id.toString().includes(searchQuery)) ||
    (entry.date && entry.date.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (entry.category && entry.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (entry.type && entry.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (entry.amount && entry.amount.toString().includes(searchQuery)) ||
    (entry.note && entry.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (entry.sentence && entry.sentence.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const rowsToDisplay = searchQuery ? filteredEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div style={{ position: 'relative', marginTop: '100px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
          position: 'absolute',
          top: '30px',
          right: '20px',
        }}
      >
        <TextField
          placeholder="Search..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
            color: theme.palette.text.primary,
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.text.primary,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={() => downloadCSV(entries)}
          sx={{
            color: 'white',
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Download Audit Log
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          marginTop: '80px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: theme.palette.background.paper, // Adapt background color to light/dark mode
        }}
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
              <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>
                Audit Entry
                <Switch 
                  size="small" 
                  checked={showColoredEntries} 
                  onChange={handleToggleChange} 
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay.map((entry) => {
              console.log('Current Entry:', entry); // Log the entire entry object
              console.log('Entry Status:', entry.status, 'ShowColoredEntries:', showColoredEntries); // Log the status and toggle state
              
              return (
                <TableRow key={entry._id}>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.id}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.date}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.category}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.type}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.amount}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #ccc' }}>{entry.note}</TableCell>
                  <TableCell 
  align="center"
  sx={{
    color: showColoredEntries
      ? entry.status === 'added'
        ? 'green'     // Added sentences will be green
        : entry.status === 'updated'
        ? 'blue'      // Updated sentences will be blue
        : entry.status === 'deleted'
        ? 'red'       // Deleted sentences will be red
        : 'inherit'
      : 'inherit',
      
  }}
>
  {entry.sentence}
</TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={searchQuery ? filteredEntries.length : entries.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>
    </div>
  );
};

export default AuditTable;