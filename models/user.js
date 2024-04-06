// models/user.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const e = require('express');
dotenv.config();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

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

  static login(username, password) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.get(query, [username], async function(err, row) {
            if (err) {
                console.error('Erro ao fazer login:', err.message);
                db.close();
                reject(new Error('Erro ao fazer login'));
                return;
            }
            console.log(row);
            console.log(row.password)
            if (!row) {
                console.log('Usuário não encontrado');
                reject(new Error('Usuário não encontrado'));
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, row.password);
            if (!isPasswordValid) {
                console.log('Credenciais inválidas');
                reject(new Error('Credenciais inválidas'));
                return;
            }

            const token = jwt.sign({ username: row.username }, process.env.JWT_SECRET);
            console.log('Login bem-sucedido');
            resolve(token);
        });
    });
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
