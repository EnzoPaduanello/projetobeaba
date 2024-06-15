const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const Funcao = sequelize.define('Funcao', {
    idFuncao:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_funcao'
    },
    nomeFuncao:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nome_funcao'
    },  
    descricaoFuncao: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao_funcao'
    }
}, {
    tableName: 'funcoes',
    timestamps: false
});

module.exports = Funcao;    