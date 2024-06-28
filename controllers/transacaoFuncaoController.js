const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');

const Transacao = require('../models/transacoes');
const Funcao = require('../models/funcoes');

const TransacaoFuncao = require('../models/transacoesFuncoes'); 

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
        
        await TransacaoFuncao.create({
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
        const transacao = await Transacao.findByPk(idTransacao, {
            include: {
                model: Funcao,
                as: 'Funcoes',
                through: { attributes: [] } // Excluir atributos da tabela de junção
            }
        });

        if (transacao) {
            res.json(transacao.Funcoes); // Retorna apenas as funções associadas
        } else {
            res.status(404).json({ error: 'Transação não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar funções associadas à transação:', error);
        res.status(500).json({ error: 'Erro ao buscar funções associadas à transação' });
    }
});


// Rota para buscar idTransacaoFuncao com base em idTransacao e idFuncao
router.get('/transacoes/:idTransacao/funcoes/:idFuncao', async (req, res) => {
    const { idTransacao, idFuncao } = req.params;
    try {
        const transacaoFuncao = await TransacaoFuncao.findOne({
            where: {
                idTransacao: idTransacao,
                idFuncao: idFuncao
            }
        });

        if (transacaoFuncao) {
            res.json({ idTransacaoFuncao: transacaoFuncao.idTransacaoFuncao });
        } else {
            res.status(404).json({ success: false, message: 'Associação não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar idTransacaoFuncao:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar idTransacaoFuncao', details: error.message });
    }
});

//Rota para remover relacionamento
router.delete('/transacoes/:idTransacaoFuncao', async (req, res) => {
    const { idTransacaoFuncao } = req.params;
    try {
        const transacaoFuncao = await TransacaoFuncao.findByPk(idTransacaoFuncao);
        if (!transacaoFuncao) {
            return res.status(404).json({ success: false, message: 'Associação não encontrada' });
        }
        await transacaoFuncao.destroy();
        res.json({ success: true, transacaoFuncao });
    } catch (error) {
        console.error('Erro ao deletar associação:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar associação' });
    }
});

module.exports = router;