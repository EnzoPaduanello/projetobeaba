const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const Usuario = require('./models/usuarios');
const Funcao = require('./models/funcoes');
const Transacao = require('./models/transacoes');
const Perfil = require('./models/perfis');
const Modulo = require('./models/modulos');

/*const TransacaoFuncao = require('./models/transacaoFuncao'); // Importação do modelo de relação
const ModuloTransacao = require('./models/moduloTransacao');
const ModuloFuncao = require('./models/moduloFuncao');*/

const app = express();
const PORT = 3000;

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));

app.get('/usuarios/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gestaoUsuarios', 'cadastroUsuarios.html'));
});

app.get('/funcoes/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gestaoFuncoes', 'cadastroFuncoes.html'))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'))
})

//Cadastros
app.post('/api/usuarios', async (req, res) => {
    try {
        const { username, email, password, matricula, idPerfil } = req.body;
        const novoUsuario = await Usuario.create({ username, email, password, matricula, idPerfil });
        res.status(201).json({ success: true, usuario: novoUsuario });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
    }
});

app.post('/api/funcoes', async (req, res) => {
    try {
        const { nomeFuncao, descricaoFuncao } = req.body;
        const novaFuncao = await Funcao.create({ nomeFuncao, descricaoFuncao })
        res.status(201).json({ success: true, funcao: novaFuncao })
    } catch (error) {
        console.error('Erro ao criar função', error)
        res.status(500).json({ success: false, message: 'Erro ao criar função' });
    }
});

app.post('/api/transacoes', async (req, res) => {
    try {
        const { nomeTransacao, descricaoTransacao } = req.body;
        const novaTransacao = await Transacao.create({ nomeTransacao, descricaoTransacao })
        res.status(201).json({ success: true, transacao: novaTransacao })
    } catch (error) {
        console.error('Erro ao criar transação', error)
        res.status(500).json({ success: false, message: 'Erro ao criar transação'})
    }
});

app.post('/api/perfis', async (req, res) => {
    try {
        const { nomePerfil, descricaoPerfil } = req.body;
        const novoPerfil = await Perfil.create({ nomePerfil, descricaoPerfil })
        res.status(201).json({ success: true, perfil: novoPerfil })
    } catch (error) {
        console.error('Erro ao criar perfil', error)
        res.status(500).json({ success: false, message: 'Erro ao criar perfil'})
    }
});

app.post('/api/modulos', async (req, res) => {
    try {
        const { nomeModulo, descricaoModulo } = req.body;
        const novoModulo = await Modulo.create({ nomeModulo, descricaoModulo })
        res.status(201).json({ success: true, modulo: novoModulo })
    } catch (error) {
        console.error('Erro ao criar modulo', error)
        res.status(500).json({ success: false, message: 'Erro ao criar modulo' })
    }
})

//Buscas
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuarios:', error);
        res.status(500).json({ error: 'Erro ao buscar usuarios '})
    }
});

app.get('/api/perfis', async (req, res) => {
    try {
        const perfis = await Perfil.findAll();
        res.json(perfis);
    } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        res.status(500).json({ error: 'Erro ao buscar perfis' });
    }
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); // Loga o erro no console
    res.status(500).send('Algo deu errado!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});