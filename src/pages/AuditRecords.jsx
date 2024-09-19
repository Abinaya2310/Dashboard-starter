import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AuditRecordsPage = () => {
  const [auditRecords, setAuditRecords] = useState([]);

  useEffect(() => {
    // Fetch audit records when the component loads
    const fetchAuditRecords = async () => {
      try {
        const response = await axios.get('/api/audit-records'); // Ensure this matches your backend route
        setAuditRecords(response.data); // Store audit records in state
      } catch (error) {
        console.error('Error fetching audit records:', error);
      }
    };

    fetchAuditRecords();
  }, []);

  return (
    <div>
      <h2>Audit Records</h2>
      <ul>
        {auditRecords.map((record) => (
          <li key={record._id}>{record.sentence}</li> // Render each audit sentence
        ))}
      </ul>
    </div>
  );
};

export default AuditRecordsPage;



