import React, { useState } from 'react';
import api from '../../services/api';
import TransactionForm from '../transactions/TransactionForm';
import './ReceiptUpload.css';

const ReceiptUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG) or PDF');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setExtractedData(null);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/jpg,image/png,application/pdf';
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileSelect({ target: input });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleScanReceipt = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('receipt', selectedFile);

      const response = await api.post('/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExtractedData(response.data.extractedData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process receipt. Please try again.');
      console.error('Receipt upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = () => {
    if (extractedData) {
      setShowTransactionForm(true);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setExtractedData(null);
    setError('');
    setShowTransactionForm(false);
  };

  const getInitialTransactionData = () => {
    if (!extractedData) return null;

    const date = extractedData.date
      ? new Date(extractedData.date)
      : new Date();

    return {
      amount: extractedData.amount || '',
      description: extractedData.description || '',
      category: '',
      date: date,
      location: extractedData.location || '',
      tax: extractedData.tax || ''
    };
  };

  if (showTransactionForm) {
    return (
      <div className="container">
        <div className="receipt-upload-container">
          <button
            className="btn btn-secondary"
            onClick={() => setShowTransactionForm(false)}
            style={{ marginBottom: '20px' }}
          >
            ← Back to Receipt Data
          </button>
          <TransactionForm
            initialData={getInitialTransactionData()}
            onSuccess={() => {
              handleReset();
              alert('Transaction created successfully!');
            }}
            onCancel={() => setShowTransactionForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="receipt-upload-container">
        <h2>Scan Receipt</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Upload a receipt image (JPG, PNG) to extract transaction information automatically.
        </p>

        <div
          className={`file-upload-area ${selectedFile ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          {preview ? (
            <div className="receipt-preview">
              <img src={preview} alt="Receipt preview" />
              <p style={{ marginTop: '10px' }}>{selectedFile.name}</p>
            </div>
          ) : selectedFile ? (
            <div>
              <p>File selected: {selectedFile.name}</p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                (PDF preview not available)
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                Click to select or drag and drop
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Supports JPG, PNG, and PDF files (max 10MB)
              </p>
            </div>
          )}
        </div>

        {selectedFile && !extractedData && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={handleScanReceipt}
              disabled={loading}
            >
              {loading ? 'Scanning Receipt...' : 'Scan Receipt'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={loading}
              style={{ marginLeft: '10px' }}
            >
              Clear
            </button>
          </div>
        )}

        {loading && (
          <div className="spinner" style={{ marginTop: '20px' }}></div>
        )}

        {error && (
          <div className="error-message" style={{ marginTop: '20px' }}>
            {error}
          </div>
        )}

        {extractedData && (
          <div className="extracted-data">
            <h3>Extracted Information</h3>
            <div className="extracted-info">
              {extractedData.amount && (
                <div className="info-item">
                  <strong>Amount:</strong> ${parseFloat(extractedData.amount).toFixed(2)}
                </div>
              )}
              {extractedData.tax && (
                <div className="info-item">
                  <strong>Tax:</strong> ${parseFloat(extractedData.tax).toFixed(2)}
                </div>
              )}
              {extractedData.date && (
                <div className="info-item">
                  <strong>Date:</strong> {extractedData.date}
                </div>
              )}
              {extractedData.location && (
                <div className="info-item">
                  <strong>Location:</strong> {extractedData.location}
                </div>
              )}
              {extractedData.description && (
                <div className="info-item">
                  <strong>Description:</strong> {extractedData.description}
                </div>
              )}
              {extractedData.items && extractedData.items.length > 0 && (
                <div className="info-item">
                  <strong>Items:</strong>
                  <ul>
                    {extractedData.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={handleCreateTransaction}
              >
                Create Transaction from Receipt
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleReset}
              >
                Scan Another Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUpload;
