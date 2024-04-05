// models/user.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Conectar ao db
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Definir o modelo de usuário
class User {
  static async register(username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], err => {
        if (err) {
          console.error('Erro ao inserir usuário:', err.message);
          throw new Error('Erro ao registrar usuário');
        } else {
          console.log('Usuário registrado com sucesso!');
        }
      });
    } catch (error) {
      throw new Error('Erro ao registrar usuário');
    }
  }

    static async login(username, password) {
      try {
        const db = await sqlite.open('./database.db');
        const row = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!row) {
          throw new Error('Usuário não encontrado');
        }
        const isPasswordValid = await bcrypt.compare(password, row.password);
        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas');
        }
        const token = jwt.sign({ username: row.username }, process.env.JWT_SECRET);
        return token;
      } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        throw new Error('Erro ao fazer login');
      }
    }


  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    
    }
}


module.exports = User;
