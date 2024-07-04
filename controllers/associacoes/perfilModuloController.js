const express = require('express');
const router = express.Router();
const sequelize = require('../../config/db');

const Perfil = require('../../models/perfis')
const Modulo = require('../../models/modulos');

const PerfilModulo = require('../../models/perfisModulos'); 

//Rota para associar uma função a uma modulo
router.post('/perfis/:idPerfil/modulos', async (req, res) => {
    const { idPerfil } = req.params;
    const { idModulo } = req.body;

    const transaction = await sequelize.transaction();
    try{
        const perfis = await Perfil.findByPk(idPerfil, { transaction });
        if (!perfis) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'perfil não encontrado' })
        }

        const modulos = await Modulo.findByPk(idModulo, { transaction });
        if (!modulos) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'modulo não encontrada' });
        }
        
        await PerfilModulo.create({
            idPerfil,
            idModulo
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
router.get('/perfis/:idPerfil/modulos', async (req, res) => {
    const { idPerfil } = req.params;
    try {
        const perfil = await Perfil.findByPk(idPerfil, {
            include: {
                model: Modulo,
                as: 'Modulos',
                through: { attributes: [] } // Excluir atributos da tabela de junção
            }
        });

        if (perfil) {
            res.json(perfil.Modulos); // Retorna apenas as funções associadas
        } else {
            res.status(404).json({ error: 'modulo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar funções associadas à modulo:', error);
        res.status(500).json({ error: 'Erro ao buscar funções associadas à modulo' });
    }
});


// Rota para buscar idPerfilModulo com base em idPerfil e idModulo
router.get('/perfis/:idPerfil/modulos/:idModulo', async (req, res) => {
    const { idPerfil, idModulo } = req.params;
    try {
        const perfilModulo = await PerfilModulo.findOne({
            where: {
                idPerfil: idPerfil,
                idModulo: idModulo
            }
        });

        if (perfilModulo) {
            res.json({ idPerfilModulo: perfilModulo.idPerfilModulo });
        } else {
            res.status(404).json({ success: false, message: 'Associação não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar idPerfilModulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar idPerfilModulo', details: error.message });
    }
});

//Rota para remover relacionamento
router.delete('/perfis/:idPerfilModulo/modulos', async (req, res) => {
    const { idPerfilModulo } = req.params;
    try {
        const perfilModulo = await PerfilModulo.findByPk(idPerfilModulo);
        if (!perfilModulo) {
            return res.status(404).json({ success: false, message: 'Associação não encontrada' });
        }
        await perfilModulo.destroy();
        res.json({ success: true, PerfilModulo });
    } catch (error) {
        console.error('Erro ao deletar associação:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar associação' });
    }
});

module.exports = router;