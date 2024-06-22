const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');

const Transacao = require('../models/transacoes');
const Funcao = require('../models/funcoes');

const TransacoesFuncoes = require('../models/transacoesFuncoes'); 

//Rota para associar uma função a uma transação
router.post('/transacoes/:idTransacao/funcoes', async (req, res) => {
    const { idTransacao } = req.params;
    const { idFuncao } = req.body;

    const transaction = await sequelize.transaction();
    try{
        const transacao = await Transacao.findByPk(idTransacao, { transaction });
        if (!transacao) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Transação não encontrada' })
        }

        const funcao = await Funcao.findByPk(idFuncao, { transaction });
        if (!funcao) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }

        await TransacoesFuncoes.create({
            idTransacao,
            idFuncao
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ success: true, message: 'Função associada a transação com sucesso'})
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao associar função a transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao associar função a transação:', details: error.message });
    }
});

// Rota para listar as funções da transação
router.get('/transacoes/:idTransacao/funcoes', async (req, res) => {
    const { idTransacao } = req.params;

    try {
        const transacoesFuncoes = await TransacoesFuncoes.findAll({
            where: { idTransacao },
            include: [Funcao]
        });
        res.status(200).json(transacoesFuncoes)
    } catch (error) {
        console.error('Erro ao buscar funções do módulo:', error)
        res.status(500).json({ success: false, message: 'Erro ao buscar funções do módulo:', details: error.message });
    }
});

module.exports = router;