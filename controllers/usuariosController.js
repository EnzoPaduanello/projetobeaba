const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuarios');

router.post('/usuarios', async (req, res) => {
    try {
        const { username, email, password, matricula, idPerfil } = req.body;
        
        // Criptografar a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Usa findOrCreate para encontrar ou criar o usuário
        const novoUsuario = await Usuario.create({ username, email, password: hashedPassword, matricula, idPerfil });

        res.status(201).json({ success: true, usuario: novoUsuario })
    } catch (error) {
        console.error('Erro ao criar ou encontrar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar ou encontrar usuário' });
    }
});

router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuarios:', error);
        res.status(500).json({ error: 'Erro ao buscar usuarios '})
    }  
});

router.get('/usuarios/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const usuario = await Usuario.findByPk(idUsuario);
        res.json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        res.status(500).json({ error: 'Erro ao buscar usuario '})
    }  
});

router.get('/usuarios/esqueciASenha/:matricula', async (req, res) => {
    const { matricula } = req.params;
    try{
        const usuario = await Usuario.findOne({
            where: {matricula}
        })

        if(usuario){
            res.json(usuario)
        } 
        else {
            res.status(404).json({ success: false, message: 'Erro ao encontrar usuario' })
        }
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        res.status(500).json({ error: 'Erro ao buscar usuario '})
    }
});

router.put('/usuarios/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;
    const { username, email, matricula, idPerfil } = req.body;
    try {
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        usuario.username = username;
        usuario.email = email;
        usuario.matricula = matricula;
        usuario.idPerfil = idPerfil;

        await usuario.save();
        res.json({ success: true, usuario });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
    }
});

router.put('/usuarios/recuperarSenha/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;
    const { password } = req.body;

    try {
        const usuario = await Usuario.findByPk(idUsuario)
        if(!usuario){
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        usuario.password = hashedPassword;

        await usuario.save();
        res.json({ success: true, usuario })
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar senha' });
    }
});

router.delete('/usuarios/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        await usuario.destroy();
        res.json({ success: true, usuario });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar usuário' });
    }
});

module.exports = router;