const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const PerfilModulo = sequelize.define('PerfilModulo', {
    idPerfilModulo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    idPerfil:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'perfis',
            key: 'id_perfil'
        }
    },
    idModulo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'modulos',
            key: 'id_modulo'
        },
        field: 'id_modulo'
    }
},{
    tableName: 'perfis_modulos',
    timestamps: false
});

module.exports = PerfilModulo