const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const gerarRelatorios = async (req, res) => {
    // Recupera os dados do corpo da requisição
    const { usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount, usuariosDados, perfisDados, modulosDados, transacoesDados, funcoesDados } = req.body;

    criarJson(usuariosDados, perfisDados, modulosDados, transacoesDados, funcoesDados)

    // Caminho absoluto para o script Python
    const scriptPath = path.join(__dirname, '../criarRelatorios.py');

    // Executa o script Python com os dados passados como argumentos
    const pythonProcess = spawn('python', [scriptPath, usuariosCount, perfisCount, modulosCount, transacoesCount, funcoesCount]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Saída Python: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro Python: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Processo Python encerrado com código ${code}`);
        res.json({ success: true, message: 'Gráfico gerado com sucesso!' });
    });
};

function criarJson(dadosUsuarios, dadosPerfis, dadosModulos, dadosTransacoes, dadosFuncoes){
    // Função para remover o campo "senha" apenas dos usuários
    function removerSenhaUsuarios(usuarios) {
        return usuarios.map(usuario => {
            if (usuario.hasOwnProperty("password")) {
                delete usuario.password;
            }
            return usuario;
        });
    }

    // Ordena os dados pelo id de cada tipo
    const dadosOrdenados = {
        usuarios: dadosUsuarios.sort((a, b) => a.idUsuario - b.idUsuario),
        perfis: dadosPerfis.sort((a, b) => a.idPerfil - b.idPerfil),
        modulos: dadosModulos.sort((a, b) => a.idModulo - b.idModulo),
        transacoes: dadosTransacoes.sort((a, b) => a.idTransacao - b.idTransacao),
        funcoes: dadosFuncoes.sort((a, b) => a.idFuncao - b.idFuncao),
    };

    // Remove a senha apenas dos usuários
    dadosOrdenados.usuarios = removerSenhaUsuarios(dadosOrdenados.usuarios);

    // Função para escrever dados em arquivos JSON
    function escreverArquivo(nomeArquivo, dados) {
        console.log(`Escrevendo arquivo JSON ${nomeArquivo}...`);
        fs.writeFile(nomeArquivo, JSON.stringify(dados, null, 4), err => {
            if (err) {
                console.error(`Erro ao escrever arquivo ${nomeArquivo}:`, err);
                return;
            }
            console.log(`Arquivo JSON "${nomeArquivo}" criado com sucesso.`);
        });
    }

    // Escreve cada conjunto de dados ordenado em seu respectivo arquivo
    escreverArquivo('usuarios.json', dadosOrdenados.usuarios);
    escreverArquivo('perfis.json', dadosOrdenados.perfis);
    escreverArquivo('modulos.json', dadosOrdenados.modulos);
    escreverArquivo('transacoes.json', dadosOrdenados.transacoes);
    escreverArquivo('funcoes.json', dadosOrdenados.funcoes);
}

module.exports = {
    gerarRelatorios,
};
