const express = require('express');
const router = express.Router();

const Modulo = require('../models/modulos');

router.post('/modulos', async (req, res) => {
    try {
        const { tagModulo, nomeModulo, descricaoModulo } = req.body;
        const novoModulo = await Modulo.create({ tagModulo, nomeModulo, descricaoModulo })
        res.status(201).json({ success: true, modulo: novoModulo })
    } catch (error) {
        console.error('Erro ao criar modulo', error)
        res.status(500).json({ success: false, message: 'Erro ao criar modulo' })
    }
});

router.get('/modulos', async (req, res) => {
    try {
        const modulos = await Modulo.findAll();
        res.json(modulos)
    } catch (error) {
        console.error('Erro ao buscar modulos')
        res.status(500).json({ error: 'Erro ao buscar modulos'})
    }
});

router.get('/modulos/:idModulo', async (req, res) => {
    const { idModulo } = req.params;
    try {
        const modulo = await Modulo.findByPk(idModulo);
        res.json(modulo);
    } catch (error) {
        console.error('Erro ao buscar modulo:', error);
        res.status(500).json({ error: 'Erro ao buscar modulo' });
    }
});

router.put('/modulos/:id', async (req, res) => {
    const { id } = req.params;
    const { tagModulo ,nomeModulo, descricaoModulo, idTransacao } = req.body;
    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }

        modulo.tagModulo = tagModulo;
        modulo.nomeModulo = nomeModulo;
        modulo.descricaoModulo = descricaoModulo;
        modulo.idTransacao = idTransacao;

        await modulo.save();
        res.json({ success: true, modulo });
    } catch (error) {
        console.error('Erro ao atualizar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar módulo' });
    }
});

router.delete('/modulos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        await modulo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar módulo' });
    }
});

module.exports = router;