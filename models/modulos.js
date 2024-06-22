const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const Modulo = sequelize.define('Modulo', {
    idModulo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        field: 'id_modulo'
    },
    tagModulo:{
        type: DataTypes.STRING(4),
        allowNull: false,
        unique: true,
        field: 'tag_modulo'
    },
    nomeModulo:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nome_modulo'
    },  
    descricaoModulo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao_modulo'
    },
    idTransacao: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'transacoes',
            key: 'id_transacao'
        },
        field: 'id_transacao'
    }
}, {
    tableName: 'modulos',
    timestamps: false
});

module.exports = Modulo;