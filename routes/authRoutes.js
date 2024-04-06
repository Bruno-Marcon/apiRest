const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.register(username, password);
    res.status(201).send('Usuário registrado com sucesso!');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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


  
router.get('/users', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send('Erro ao buscar usuários');
  }
});

module.exports = router;

