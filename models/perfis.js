const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const Perfil = sequelize.define('Perfil', {
    idPerfil:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_perfil'
    },
    nomePerfil:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nome_perfil'
    },
    descricaoPerfil: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao_perfil'
    }
}, {
    tableName: 'perfis',
    timestamps: false
});

module.exports = Perfil;   