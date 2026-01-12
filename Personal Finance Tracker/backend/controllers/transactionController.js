const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
  try {
    const { amount, description, category, date, location, tax } = req.body;

    if (!amount || !date) {
      return res.status(400).json({ error: 'Amount and date are required' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const transaction = await Transaction.create(req.user.id, {
      amount: parseFloat(amount),
      description,
      category,
      date,
      location,
      tax: tax ? parseFloat(tax) : 0
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Server error creating transaction' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findByUserId(req.user.id);
    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error fetching transactions' });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Server error fetching transaction' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, date, location, tax } = req.body;

    const existingTransaction = await Transaction.findById(id);
    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (existingTransaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const transaction = await Transaction.update(id, req.user.id, {
      amount: amount !== undefined ? parseFloat(amount) : existingTransaction.amount,
      description: description !== undefined ? description : existingTransaction.description,
      category: category !== undefined ? category : existingTransaction.category,
      date: date || existingTransaction.date,
      location: location !== undefined ? location : existingTransaction.location,
      tax: tax !== undefined ? parseFloat(tax) : existingTransaction.tax
    });

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Server error updating transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTransaction = await Transaction.findById(id);
    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (existingTransaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deleted = await Transaction.delete(id, req.user.id);
    if (deleted) {
      res.json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Server error deleting transaction' });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
};
