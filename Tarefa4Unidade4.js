const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send({ error: 'Acesso negado. Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ error: 'Token inválido.' });
  }
};

module.exports = authenticateToken;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Atualize conforme seu modelo de usuário

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password: await bcrypt.hash(password, 10) });
    await user.save();
    res.status(201).send({ message: 'Usuário registrado com sucesso.' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Task = require('./models/Task'); // Atualize conforme seu modelo de tarefa
const authenticateToken = require('./authMiddleware');

// Rota para adicionar tarefa
router.post('/tasks', authenticateToken, async (req, res) => {
  const task = new Task({ ...req.body, user: req.user._id });
  await task.save();
  res.status(201).send(task);
});

// Rota para listar tarefas
router.get('/tasks', authenticateToken, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.send(tasks);
});

module.exports = router;

// Rota para editar tarefa
router.put('/tasks/:id', authenticateToken, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task.user.toString() !== req.user._id) {
      return res.status(403).send({ error: 'Ação não permitida.' });
    }
    Object.assign(task, req.body);
    await task.save();
    res.send(task);
  });
  
  // Rota para excluir tarefa
  router.delete('/tasks/:id', authenticateToken, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task.user.toString() !== req.user._id) {
      return res.status(403).send({ error: 'Ação não permitida.' });
    }
    await task.remove();
    res.send({ message: 'Tarefa excluída com sucesso.' });
  });

  {
    "username": "seu_usuario",
    "password": "sua_senha"
  }

  {
    "token": "seu_token_jwt"
  }

    