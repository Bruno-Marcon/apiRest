// routes/authRoutes.js
const express = require('express');
const User = require('../models/user');

const router = express.Router();


// Rota para registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.register(username, password);
    res.status(201).send('Usuário registrado com sucesso!');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para login de usuário
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const token = await User.login(username, password);
      if (token) {
        res.status(200).json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao fazer login' });
    }
  });
  
// Endpoint para listar todos os usuários
router.get('/users', async (req, res) => {
  try {
    // Consultar todos os usuários no banco de dados
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send('Erro ao buscar usuários');
  }
});

module.exports = router;