const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const Transacao = sequelize.define('Transacao', {
    idTransacao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_transacao'
    },
    tagTransacao:{
        type: DataTypes.STRING(4),
        allowNull: false,
        unique: true,
        field: 'tag_transacao'
    },
    nomeTransacao:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nome_transacao'
    },  
    descricaoTransacao: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao_transacao'
    }
}, {
    tableName: 'transacoes',
    timestamps: false
});

module.exports = Transacao;    