import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ReportsView = () => {
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReportsData(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="reports-placeholder">
        <h2>Reports</h2>
        <p>Reports feature coming soon!</p>
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'left', maxWidth: '600px', margin: '30px auto' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Future Features:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <strong>Monthly/Yearly Summaries:</strong> View spending summaries by month or year
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <strong>Category Breakdown:</strong> See spending distribution across categories
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <strong>Spending Trends:</strong> Track spending patterns over time
            </li>
            <li style={{ padding: '8px 0' }}>
              <strong>Charts & Visualizations:</strong> Interactive charts and graphs for better insights
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
