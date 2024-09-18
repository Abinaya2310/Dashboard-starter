import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AuditRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchAuditRecords = async () => {
      try {
        const response = await axios.get('/api/audit-records'); // Ensure the route matches the backend
        setRecords(response.data);
      } catch (err) {
        console.error('Error fetching audit records:', err);
      }
    };

    fetchAuditRecords();
  }, []);

  return (
    <div>
      <h1>Audit Records</h1>
      <div>
        {records.length > 0 ? (
          records.map((record, index) => (
            <p key={index}>{record.message}</p>
          ))
        ) : (
          <p>No audit records available.</p>
        )}
      </div>
    </div>
  );
};

export default AuditRecords;

