const { dbGet, dbRun } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    return user;
  }

  static async findByUsername(username) {
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    return user;
  }

  static async findById(id) {
    const user = await dbGet('SELECT id, username, email, createdAt FROM users WHERE id = ?', [id]);
    return user;
  }

  static async create(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return { id: result.id, username, email };
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
