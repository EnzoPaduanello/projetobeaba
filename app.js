const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const Usuario = require('./models/usuarios');
const Perfil = require('./models/perfis');
const Modulo = require('./models/modulos');
const Transacao = require('./models/transacoes');
const Funcao = require('./models/funcoes');

const PerfilModulo = require('./models/perfisModulos');
const ModuloFuncao = require('./models/modulosFuncoes');
const TransacaoFuncao = require('./models/transacoesFuncoes');

const associarTransacaoFuncao = require('./controllers/transacaoFuncaoController');

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

//Rotas para associar o app com os controlers de associação
app.use('/api', associarTransacaoFuncao);

//Rotas usuários
app.get('/usuarios/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuarios', 'cadastro.html'));
});

app.get('/usuarios/gerenciamento', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuarios', 'gerenciamento.html'))
});

app.get('/usuarios/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuarios', 'edicaoUsuario.html'));
});

//Rotas perfis
app.get('/perfis/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfis', 'cadastro.html'));
});

app.get('/perfis/gerenciamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfis', 'gerenciamento.html'))
});

app.get('/perfis/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfis', 'edicaoPerfil.html'))
})

//Rotas modulos
app.get('/modulos/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modulos', 'cadastro.html'));
});

app.get('/modulos/gerenciamento', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'modulos', 'gerenciamento.html'))
});

app.get('/modulos/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modulos', 'edicaoModulo.html'))
});

//Rotas transações
app.get('/transacoes/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transacoes', 'cadastro.html'));
});

app.get('/transacoes/gerenciamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transacoes', 'gerenciamento.html'));
});

app.get('/transacoes/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transacoes', 'edicaoTransacao.html'))
});

//Rotas funções
app.get('/funcoes/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'funcoes', 'cadastro.html'));
});

app.get('/funcoes/gerenciamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'funcoes', 'gerenciamento.html'))
});

app.get('/funcoes/edicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'funcoes', 'edicaoFuncao.html'))
});

//Outras rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'))
});

app.get('/associacoes/transacaoFuncao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'associacoes', 'transacoesFuncoes.html'))
});

app.get('/associacoes/moduloFuncao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'associacoes', 'modulosFuncoes.html'))
});

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
        const { tagModulo, nomeModulo, descricaoModulo } = req.body;
        const novoModulo = await Modulo.create({ tagModulo, nomeModulo, descricaoModulo })
        res.status(201).json({ success: true, modulo: novoModulo })
    } catch (error) {
        console.error('Erro ao criar modulo', error)
        res.status(500).json({ success: false, message: 'Erro ao criar modulo' })
    }
})

app.post('/api/funcoes', async (req, res) => {
    try {
        const { tagFuncao, nomeFuncao, descricaoFuncao } = req.body;
        const novaFuncao = await Funcao.create({  tagFuncao, nomeFuncao, descricaoFuncao })
        res.status(201).json({ success: true, funcao: novaFuncao })
    } catch (error) {
        console.error('Erro ao criar função', error)
        res.status(500).json({ success: false, message: 'Erro ao criar função' });
    }
});

app.post('/api/transacoes', async (req, res) => {
    try {
        const { tagTransacao, nomeTransacao, descricaoTransacao } = req.body;
        const novaTransacao = await Transacao.create({ tagTransacao, nomeTransacao, descricaoTransacao })
        res.status(201).json({ success: true, transacao: novaTransacao })
    } catch (error) {
        console.error('Erro ao criar transação', error)
        res.status(500).json({ success: false, message: 'Erro ao criar transação'})
    }
});

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

app.get('/api/usuarios/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const usuario = await Usuario.findByPk(idUsuario);
        res.json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        res.status(500).json({ error: 'Erro ao buscar usuario '})
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

app.get('/api/perfis/:idPerfil', async (req, res) => {
    const { idPerfil } = req.params;
    try {
        const perfis = await Perfil.findByPk(idPerfil);
        res.json(perfis);
    } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        res.status(500).json({ error: 'Erro ao buscar perfis' });
    }
});

app.get('/api/modulos', async (req, res) => {
    try {
        const modulos = await Modulo.findAll();
        res.json(modulos)
    } catch (error) {
        console.error('Erro ao buscar modulos')
        res.status(500).json({ error: 'Erro ao buscar modulos'})
    }
});

app.get('/api/modulos/:idModulo', async (req, res) => {
    const { idModulo } = req.params;
    try {
        const modulo = await Modulo.findByPk(idModulo);
        res.json(modulo);
    } catch (error) {
        console.error('Erro ao buscar modulo:', error);
        res.status(500).json({ error: 'Erro ao buscar modulo' });
    }
});

app.get('/api/transacoes/', async (req, res) => {
    try {
        const transacoes = await Transacao.findAll();
        res.json(transacoes)
    } catch (error) {
        console.error('Erro ao buscar transações')
        res.status(500).json({ error: 'Erro ao buscar transações'})
    }
});

app.get('/api/transacoes/:idTransacao', async (req, res) => {
    const { idTransacao } = req.params;
    try{
        const transacao = await Transacao.findByPk(idTransacao);
        res.json(transacao)
    } catch (error) {
        console.error('Erro ao buscar transações')
        res.status(500).json({ error: 'Erro ao buscar transações'})
    }
});

app.get('/api/funcoes', async (req, res) => {
    try {
        const funcoes = await Funcao.findAll();
        res.json(funcoes)
    } catch (error) {
        console.error('Erro ao buscar funções:', error)
        res.status(500).json({ error: 'Erro ao buscar funções '})
    }
});

app.get('/api/funcoes/:idFuncao', async (req, res) => {
    const { idFuncao } = req.params;
    try {
        const funcao = await Funcao.findByPk(idFuncao);
        res.json(funcao)
    } catch (error) {
        console.error('Erro ao buscar funções:', error)
        res.status(500).json({ error: 'Erro ao buscar funções '})
    }
});


//Atualizações de cadastro
app.put('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, matricula, idPerfil } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        usuario.username = username;
        usuario.email = email;
        usuario.password = password;
        usuario.matricula = matricula;
        usuario.idPerfil = idPerfil;

        await usuario.save();
        res.json({ success: true, usuario });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
    }
});

app.put('/api/perfis/:id', async (req, res) => {
    const { id } = req.params;
    const { nomePerfil, descricaoPerfil } = req.body;
    try {
        const perfil = await Perfil.findByPk(id);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }

        perfil.nomePerfil = nomePerfil;
        perfil.descricaoPerfil = descricaoPerfil;

        await perfil.save();
        res.json({ success: true, perfil });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar perfil' });
    }
});

app.put('/api/modulos/:id', async (req, res) => {
    const { id } = req.params;
    const { tagModulo ,nomeModulo, descricaoModulo, idTransacao } = req.body;
    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }

        modulo.tagModulo = tagModulo;
        modulo.nomeModulo = nomeModulo;
        modulo.descricaoModulo = descricaoModulo;
        modulo.idTransacao = idTransacao;

        await modulo.save();
        res.json({ success: true, modulo });
    } catch (error) {
        console.error('Erro ao atualizar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar módulo' });
    }
});

app.put('/api/transacoes/:id', async (req, res) => {
    const { id } = req.params;
    const { tagTransacao, nomeTransacao, descricaoTransacao } = req.body;
    try {
        const transacao = await Transacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }

        transacao.tagTransacao = tagTransacao;
        transacao.nomeTransacao = nomeTransacao;
        transacao.descricaoTransacao = descricaoTransacao;

        await transacao.save();
        res.json({ success: true, transacao });
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar transação' });
    }
});

app.put('/api/funcoes/:id', async (req, res) => {
    const { id } = req.params;
    const { tagFuncao, nomeFuncao, descricaoFuncao } = req.body;
    try {
        const funcao = await Funcao.findByPk(id);
        if (!funcao) {
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }

        funcao.tagFuncao = tagFuncao;
        funcao.nomeFuncao = nomeFuncao;
        funcao.descricaoFuncao = descricaoFuncao;
        
        await funcao.save();
        res.json({ success: true, funcao });
    } catch (error) {
        console.error('Erro ao atualizar função:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar função' });
    }
});

//Deleções
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        await usuario.destroy();
        res.json({ success: true, usuario });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar usuário' });
    }
});

app.delete('/api/perfis/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const perfil = await Perfil.findByPk(id);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }
        await perfil.destroy();
        res.json({ success: true, perfil });
    } catch (error) {
        console.error('Erro ao deletar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar perfil' });
    }
});

app.delete('/api/modulos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        await modulo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar módulo' });
    }
});

app.delete('/api/transacoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const transacao = await Transacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }
        await transacao.destroy();
        res.json({ success: true, transacao });
    } catch (error) {
        console.error('Erro ao deletar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar transação' });
    }
});

app.put('/api/funcoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const funcao = await Funcao.findByPk(id);
        if (!funcao) {
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }
        await funcao.destroy();
        res.json({ success: true, funcao });
    } catch (error) {
        console.error('Erro ao deletar função:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar função' });
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