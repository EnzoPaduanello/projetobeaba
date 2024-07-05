const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Usuario = require('../models/usuarios');

const SECRET_KEY = 'QQTech6@2024#';

// Rota POST para login
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        let usuario;
        if (!isNaN(parseInt(login))) {
            // Se o login pode ser convertido para número, pesquisa por matricula
            usuario = await Usuario.findOne({ where: { matricula: login } });
        } else {
            // Caso contrário, pesquisa por email
            usuario = await Usuario.findOne({ where: { email: login } });
        }

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gera o token JWT
        const token = jwt.sign({ id: usuario.idUsuario, matricula: usuario.matricula, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});

module.exports = router;
