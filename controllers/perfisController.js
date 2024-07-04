const express = require('express');
const router = express.Router();

const Perfil = require('../models/perfis');

router.post('/perfis', async (req, res) => {
    try {
        const { nomePerfil, descricaoPerfil } = req.body;
        const novoPerfil = await Perfil.create({ nomePerfil, descricaoPerfil })
        res.status(201).json({ success: true, perfil: novoPerfil })
    } catch (error) {
        console.error('Erro ao criar perfil', error)
        res.status(500).json({ success: false, message: 'Erro ao criar perfil'})
    }
});

router.get('/perfis', async (req, res) => {
    try {
        const perfis = await Perfil.findAll();
        res.json(perfis);
    } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        res.status(500).json({ error: 'Erro ao buscar perfis' });
    }
});

router.get('/perfis/:idPerfil', async (req, res) => {
    const { idPerfil } = req.params;
    try {
        const perfis = await Perfil.findByPk(idPerfil);
        res.json(perfis);
    } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        res.status(500).json({ error: 'Erro ao buscar perfis' });
    }
});

router.put('/perfis/:idPerfil', async (req, res) => {
    const { idPerfil } = req.params;
    const { nomePerfil, descricaoPerfil } = req.body;
    try {
        const perfil = await Perfil.findByPk(idPerfil);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }

        perfil.nomePerfil = nomePerfil;
        perfil.descricaoPerfil = descricaoPerfil;

        await perfil.save();
        res.json({ success: true, perfil });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar perfil' });
    }
});

router.delete('/perfis/:idPerfil', async (req, res) => {
    const { idPerfil } = req.params;
    try {
        const perfil = await Perfil.findByPk(idPerfil);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }
        await perfil.destroy();
        res.json({ success: true, perfil });
    } catch (error) {
        console.error('Erro ao deletar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar perfil' });
    }
});

module.exports = router;