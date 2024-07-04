const express = require('express');
const router = express.Router();

const Transacao = require('../models/transacoes');

router.post('/transacoes', async (req, res) => {
    try {
        const { tagTransacao, nomeTransacao, descricaoTransacao } = req.body;
        const novaTransacao = await Transacao.create({ tagTransacao, nomeTransacao, descricaoTransacao });
        res.status(201).json({ success: true, transacao: novaTransacao })
    } catch (error) {
        console.error('Erro ao criar transação', error)
        res.status(500).json({ success: false, message: 'Erro ao criar transação'})
    }
});

router.get('/transacoes/', async (req, res) => {
    try {
        const transacoes = await Transacao.findAll();
        res.json(transacoes)
    } catch (error) {
        console.error('Erro ao buscar transações')
        res.status(500).json({ error: 'Erro ao buscar transações'})
    }
});

router.get('/transacoes/:idTransacao', async (req, res) => {
    const { idTransacao } = req.params;
    try{
        const transacao = await Transacao.findByPk(idTransacao);
        res.json(transacao)
    } catch (error) {
        console.error('Erro ao buscar transações')
        res.status(500).json({ error: 'Erro ao buscar transações'})
    }
});

router.put('/transacoes/:id', async (req, res) => {
    const { id } = req.params;
    const { tagTransacao, nomeTransacao, descricaoTransacao } = req.body;
    try {
        const transacao = await Transacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }

        transacao.tagTransacao = tagTransacao;
        transacao.nomeTransacao = nomeTransacao;
        transacao.descricaoTransacao = descricaoTransacao;

        await transacao.save();
        res.json({ success: true, transacao });
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar transação' });
    }
});

router.delete('/transacoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const transacao = await Transacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }
        await transacao.destroy();
        res.json({ success: true, transacao });
    } catch (error) {
        console.error('Erro ao deletar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar transação' });
    }
});

module.exports = router;