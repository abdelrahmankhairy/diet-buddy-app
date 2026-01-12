import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../services/api';

const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

const TransactionForm = ({ onSuccess, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    location: initialData?.location || '',
    tax: initialData?.tax || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const transactionData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      if (initialData) {
        // Update existing transaction
        await api.put(`/transactions/${initialData.id}`, transactionData);
      } else {
        // Create new transaction
        await api.post('/transactions', transactionData);
      }

      if (onSuccess) {
        onSuccess();
      }

      // Reset form if creating new transaction
      if (!initialData) {
        setFormData({
          amount: '',
          description: '',
          category: '',
          date: new Date(),
          location: '',
          tax: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{initialData ? 'Edit Transaction' : 'Add New Transaction'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter transaction description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            wrapperClassName="date-picker-wrapper"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Transaction location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tax">Tax</label>
          <input
            type="number"
            id="tax"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Saving...' : (initialData ? 'Update' : 'Add Transaction')}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
