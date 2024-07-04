const express = require('express');
const router = express.Router();

const Funcao = require('../models/funcoes');

router.post('/funcoes', async (req, res) => {
    try {
        const { tagFuncao, nomeFuncao, descricaoFuncao } = req.body;
        const novaFuncao = await Funcao.create({  tagFuncao, nomeFuncao, descricaoFuncao })
        res.status(201).json({ success: true, funcao: novaFuncao })
    } catch (error) {
        console.error('Erro ao criar função', error)
        res.status(500).json({ success: false, message: 'Erro ao criar função' });
    }
});

router.get('/funcoes', async (req, res) => {
    try {
        const funcoes = await Funcao.findAll();
        res.json(funcoes)
    } catch (error) {
        console.error('Erro ao buscar funções:', error)
        res.status(500).json({ error: 'Erro ao buscar funções '})
    }
});

router.get('/funcoes/:idFuncao', async (req, res) => {
    const { idFuncao } = req.params;
    try {
        const funcao = await Funcao.findByPk(idFuncao);
        res.json(funcao)
    } catch (error) {
        console.error('Erro ao buscar funções:', error)
        res.status(500).json({ error: 'Erro ao buscar funções '})
    }
});

router.put('/funcoes/:id', async (req, res) => {
    const { id } = req.params;
    const { tagFuncao, nomeFuncao, descricaoFuncao } = req.body;
    try {
        const funcao = await Funcao.findByPk(id);
        if (!funcao) {
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }

        funcao.tagFuncao = tagFuncao;
        funcao.nomeFuncao = nomeFuncao;
        funcao.descricaoFuncao = descricaoFuncao;
        
        await funcao.save();
        res.json({ success: true, funcao });
    } catch (error) {
        console.error('Erro ao atualizar função:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar função' });
    }
});

router.delete('/funcoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const funcao = await Funcao.findByPk(id);
        if (!funcao) {
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }
        await funcao.destroy();
        res.json({ success: true, funcao });
    } catch (error) {
        console.error('Erro ao deletar função:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar função' });
    }
});

module.exports = router;