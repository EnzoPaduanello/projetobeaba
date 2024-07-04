const express = require('express');
const router = express.Router();
const sequelize = require('../../config/db');

const Modulo = require('../../models/modulos');
const Funcao = require('../../models/funcoes');

const ModuloFuncao = require('../../models/modulosFuncoes'); 

//Rota para associar uma função a uma modulo
router.post('/modulos/:idModulo/funcoes', async (req, res) => {
    const { idModulo } = req.params;
    const { idFuncao } = req.body;

    const transaction = await sequelize.transaction();
    try{
        const modulo = await Modulo.findByPk(idModulo, { transaction });
        if (!modulo) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'modulo não encontrado' })
        }

        const funcao = await Funcao.findByPk(idFuncao, { transaction });
        if (!funcao) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }
        
        await ModuloFuncao.create({
            idModulo,
            idFuncao
        }, { transaction });
        
        await transaction.commit();
        res.status(200).json({ success: true, message: 'Função associada a modulo com sucesso'})
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao associar função a modulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao associar função a modulo:', details: error.message });
    }
});

// Rota para listar as funções da modulo
router.get('/modulos/:idModulo/funcoes', async (req, res) => {
    const { idModulo } = req.params;
    try {
        const modulo = await Modulo.findByPk(idModulo, {
            include: {
                model: Funcao,
                as: 'Funcoes',
                through: { attributes: [] } // Excluir atributos da tabela de junção
            }
        });

        if (modulo) {
            res.json(modulo.Funcoes); // Retorna apenas as funções associadas
        } else {
            res.status(404).json({ error: 'modulo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar funções associadas à modulo:', error);
        res.status(500).json({ error: 'Erro ao buscar funções associadas à modulo' });
    }
});


// Rota para buscar idModuloFuncao com base em idModulo e idFuncao
router.get('/modulos/:idModulo/funcoes/:idFuncao', async (req, res) => {
    const { idModulo, idFuncao } = req.params;
    try {
        const moduloFuncao = await ModuloFuncao.findOne({
            where: {
                idModulo: idModulo,
                idFuncao: idFuncao
            }
        });

        if (moduloFuncao) {
            res.json({ idModuloFuncao: moduloFuncao.idModuloFuncao });
        } else {
            res.status(404).json({ success: false, message: 'Associação não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar idModuloFuncao:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar idModuloFuncao', details: error.message });
    }
});

// Rota para remover relacionamento
router.delete('/modulos/:idModuloFuncao/funcoes', async (req, res) => {
    const { idModuloFuncao } = req.params;
    try {
        const moduloFuncao = await ModuloFuncao.findByPk(idModuloFuncao);
        if (!moduloFuncao) {
            return res.status(404).json({ success: false, message: 'Associação não encontrada' });
        }
        await moduloFuncao.destroy();
        res.json({ success: true, moduloFuncao });
    } catch (error) {
        console.error('Erro ao deletar associação:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar associação' });
    }
});



module.exports = router;