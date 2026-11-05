require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// Só aceita requisições vindas do seu site no GitHub Pages
app.use(cors({ origin: process.env.FRONTEND_URL }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro no MongoDB:', err));

const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nome:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  senha: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
}));

app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha precisa ter ao menos 6 caracteres.' });
    }

    const hash = await bcrypt.hash(senha, 10);
    await Usuario.create({ nome, email, senha: hash });

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

app.get('/', (req, res) => res.send('API no ar'));

app.listen(process.env.PORT || 3000, () => console.log('Servidor rodando'));