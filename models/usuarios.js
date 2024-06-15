const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

// Define o modelo 'Usuario'
const Usuario = sequelize.define('Usuario', {
    // Atributos do modelo
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Certifique-se de que o campo de incremento automático é a chave primária
        field: 'id_usuario'
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'nome_usuario'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'senha'
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    idPerfil: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'perfis',
            key: 'id_perfil'
        },
        field: 'id_perfil'
    }
}, {
    // Opções do modelo
    tableName: 'usuarios',
    timestamps: true // Sequelize adiciona automaticamente os campos createdAt e updatedAt
});

// Exporta o modelo
module.exports = Usuario;
