const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

//Models
const Usuario = require('./models/usuarios');
const Perfil = require('./models/perfis');
const Modulo = require('./models/modulos');
const Transacao = require('./models/transacoes');
const Funcao = require('./models/funcoes');

const PerfilModulo = require('./models/perfisModulos');
const ModuloFuncao = require('./models/modulosFuncoes');
const TransacaoFuncao = require('./models/transacoesFuncoes');

//Controllers
const usuariosController = require('./controllers/usuariosController');
const perfisController = require('./controllers/perfisController');
const modulosController = require('./controllers/modulosController');
const transacoesController = require('./controllers/transacoesController');
const funcoesController = require('./controllers/funcoesController');

const loginController = require('./controllers/loginController');
const esqueciASenhaController = require('./controllers/esqueciASenhaController');
const gerarRelatoriosController = require('./controllers/gerarRelatoriosController');
const authorize = require('./middlewares/authMiddleware');

const associarPerfilModulo = require('./controllers/associacoes/perfilModuloController');
const associarModuloFuncao = require('./controllers/associacoes/moduloFuncaoController');
const associarTransacaoFuncao = require('./controllers/associacoes/transacaoFuncaoController');

// Inicialização do app
const app = express();
const PORT = 3000;

//Configurações de relacionamentos

//Perfil e Modulo
Perfil.belongsToMany(Modulo, {
    through: PerfilModulo,
    foreignKey: 'idPerfil',
    otherKey: 'idModulo',
    as: 'Modulos'
});
Modulo.belongsToMany(Perfil, {
    through: PerfilModulo,
    foreignKey: 'idModulo',
    otherKey: 'idPerfil',
    as: 'Perfis'
});

//Modulo e Função
Modulo.belongsToMany(Funcao, {
    through: ModuloFuncao,
    foreignKey: 'idModulo',
    otherKey: 'idFuncao',
    as: 'Funcoes'
});
Funcao.belongsToMany(Modulo, {
    through: ModuloFuncao,
    foreignKey: 'idFuncao',
    otherKey: 'idModulo',
    as: 'Modulos'
});

//Transação e Função
Transacao.belongsToMany(Funcao, {
    through: TransacaoFuncao,
    foreignKey:'idTransacao',
    otherKey: 'idFuncao',
    as: 'Funcoes'
});
Funcao.belongsToMany(Transacao, {
    through: TransacaoFuncao,
    foreignKey: 'idFuncao',
    otherKey: 'idTransacao',
    as: 'Transacoes'
});

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());
app.use(express.json());

// Middleware para servir arquivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Middleware de autenticação para todas as rotas API, exceto /api/login e /api/esqueciASenha
app.use('/api', (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (req.path === '/login' || req.path === '/esqueciASenha/enviarEmail' || '/gerarRelatorios') {
        // Ignora a autenticação para /api/login e /api/esqueciASenha/enviarEmail
        next();
    } else if (authHeader) {
        authorize(req, res, next); // Aplica o middleware de autenticação para outras rotas /api
    } else {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
});

//Rotas para associar o app com os controllers principais
app.use('/api', usuariosController);
app.use('/api', perfisController);
app.use('/api', modulosController);
app.use('/api', transacoesController);
app.use('/api', funcoesController);

app.use('/api', loginController);

//Rotas para associar o app com os controllers de associação
app.use('/api', associarPerfilModulo);
app.use('/api', associarModuloFuncao);
app.use('/api', associarTransacaoFuncao);

//Rota para envio de email
app.post('/api/esqueciASenha/enviarEmail', esqueciASenhaController.sendEmail);
// Rota para gerar o gráfico
app.post('/api/gerarRelatorios', gerarRelatoriosController.gerarRelatorios);

//Rota para gerar os graficos na página de dashboard
app.get('/api/gerarRelatorios', (req, res) => {
    // Caminho absoluto para o script Python
    const pythonScriptPath = path.join(__dirname, 'criarRelatorios.py');

    // Comando para chamar o script Python
    const comando = `python3 ${pythonScriptPath}`;

    // Executa o comando
    exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar o comando: ${error.message}`);
            return res.status(500).send('Erro ao gerar gráfico');
        }
        if (stderr) {
            console.error(`Erro padrão do comando: ${stderr}`);
            return res.status(500).send('Erro ao gerar gráfico');
        }

        // Se tudo ocorrer bem, retorna sucesso
        console.log(`Gráfico gerado com sucesso: ${stdout}`);
        res.send('Gráfico gerado com sucesso!');
    });
});

// Rota para download do arquivo XLSX
app.get('/download', (req, res) => {
    const file = path.join(__dirname, 'dados.xlsx');
    res.download(file, 'dados.xlsx', (err) => {
        if (err) {
            console.log('Erro ao fazer o download:', err);
            res.status(500).send('Erro ao fazer o download do arquivo.');
        }
    });
});

//Rotas usuários
app.get('/usuarios/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuarios', 'cadastroUsuarios.html'));
});

app.get('/usuarios/gerenciamento', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuarios', 'gerenciamentoUsuarios.html'))
});

app.get('/usuarios/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuarios', 'edicaoUsuarios.html'));
});

//Rotas perfis
app.get('/perfis/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfis', 'cadastroPerfis.html'));
});

app.get('/perfis/gerenciamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfis', 'gerenciamentoPerfis.html'))
});

app.get('/perfis/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfis', 'edicaoPerfis.html'))
})

//Rotas modulos
app.get('/modulos/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modulos', 'cadastroModulos.html'));
});

app.get('/modulos/gerenciamento', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'modulos', 'gerenciamentoModulos.html'))
});

app.get('/modulos/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modulos', 'edicaoModulos.html'))
});

//Rotas transações
app.get('/transacoes/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transacoes', 'cadastroTransacoes.html'));
});

app.get('/transacoes/gerenciamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transacoes', 'gerenciamentoTransacoes.html'));
});

app.get('/transacoes/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transacoes', 'edicaoTransacoes.html'))
});

//Rotas funções
app.get('/funcoes/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'funcoes', 'cadastroFuncoes.html'));
});

app.get('/funcoes/gerenciamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'funcoes', 'gerenciamentoFuncoes.html'))
});

app.get('/funcoes/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'funcoes', 'edicaoFuncoes.html'))
});

//Outras rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'))
});

app.get('/associacoes/perfilModulo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'associacoes', 'perfisModulos.html'))
});

app.get('/associacoes/moduloFuncao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'associacoes', 'modulosFuncoes.html'))
});

app.get('/associacoes/transacaoFuncao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'associacoes', 'transacoesFuncoes.html'))
});

app.get('/dashboards', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'))
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

app.get('/esqueciASenha', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'esqueciASenha.html'))
});

app.get('/recuperarSenha', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'recuperarSenha.html'))
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); // Loga o erro no console
    res.status(500).send('Algo deu errado!');
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor rodando na porta ${PORT}`);
});