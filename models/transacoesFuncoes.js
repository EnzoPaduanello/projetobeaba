const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const TransacaoFuncao = sequelize.define('TransacaoFuncao', {
    idTransacaoFuncao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    idTransacao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'transacoes',
            key: 'id_transacao'
        },
        field: 'id_transacao'
    },
    idFuncao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'funcoes',
            key: 'id_funcao'
        }
    }
},{
    tableName: 'transacoes_funcoes',
    timestamps: false
});

module.exports = TransacaoFuncao