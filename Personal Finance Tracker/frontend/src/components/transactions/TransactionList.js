import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import TransactionForm from './TransactionForm';
import './TransactionList.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data.transactions || []);
      setError('');
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete transaction');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showForm) {
    return (
      <TransactionForm
        initialData={editingTransaction}
        onSuccess={handleFormSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Transactions</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Transaction
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions yet. Add your first transaction to get started!</p>
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
                  <span> • {formatDate(transaction.date)}</span>
                  {transaction.tax > 0 && <span> • Tax: {formatCurrency(transaction.tax)}</span>}
                </div>
              </div>
              <div className="transaction-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(transaction)}
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(transaction.id)}
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
