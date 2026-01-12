const { dbRun, dbGet, dbAll } = require('../config/database');

class Transaction {
  static async create(userId, transactionData) {
    const { amount, description, category, date, location, tax } = transactionData;
    const result = await dbRun(
      `INSERT INTO transactions (userId, amount, description, category, date, location, tax)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, amount, description || null, category || null, date, location || null, tax || 0]
    );
    return await this.findById(result.id);
  }

  static async findById(id) {
    return await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
  }

  static async findByUserId(userId) {
    return await dbAll(
      'SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC, createdAt DESC',
      [userId]
    );
  }

  static async update(id, userId, transactionData) {
    const { amount, description, category, date, location, tax } = transactionData;
    await dbRun(
      `UPDATE transactions
       SET amount = ?, description = ?, category = ?, date = ?, location = ?, tax = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ? AND userId = ?`,
      [amount, description || null, category || null, date, location || null, tax || 0, id, userId]
    );
    return await this.findById(id);
  }

  static async delete(id, userId) {
    const result = await dbRun(
      'DELETE FROM transactions WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return result.changes > 0;
  }
}

module.exports = Transaction;
