import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      const allTransactions = response.data.transactions || [];
      // Get only the 5 most recent transactions
      setTransactions(allTransactions.slice(0, 5));
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotal = () => {
    return transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Welcome to your Personal Finance Tracker
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Recent Transactions</h3>
          <p className="stat-value">{transactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total (Recent)</h3>
          <p className="stat-value">{formatCurrency(calculateTotal())}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/transactions')}
        >
          View All Transactions
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/receipts')}
        >
          Scan Receipt
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/reports')}
        >
          View Reports
        </button>
      </div>

      <div className="dashboard-section">
        <h2>Recent Transactions</h2>
        {loading ? (
          <div className="spinner"></div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet. Add your first transaction to get started!</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/transactions')}
              style={{ marginTop: '20px' }}
            >
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-amount">
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="transaction-description">
                    {transaction.description || 'No description'}
                  </div>
                  <div className="transaction-meta">
                    {transaction.category && <span className="badge">{transaction.category}</span>}
                    {transaction.location && <span> • {transaction.location}</span>}
                    <span> • {new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length >= 5 && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/transactions')}
                >
                  View All Transactions
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
