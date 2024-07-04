const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const Usuario = require('../models/usuarios');

// Rota POST para login
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        let user;
        if (!isNaN(parseInt(login))) {
            // Se o login pode ser convertido para número, pesquisa por matricula
            user = await Usuario.findOne({ where: { matricula: login } });
        } else {
            // Caso contrário, pesquisa por email
            user = await Usuario.findOne({ where: { email: login } });
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});

module.exports = router;
