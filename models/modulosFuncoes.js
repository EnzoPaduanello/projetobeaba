const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const ModuloFuncao = sequelize.define('ModuloFuncao', {
    idModuloFuncao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    idModulo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'modulos',
            key: 'id_modulo'
        },
        field: 'id_modulo'
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
    tableName: 'modulos_funcoes',
    timestamps: false
});

module.exports = ModuloFuncao