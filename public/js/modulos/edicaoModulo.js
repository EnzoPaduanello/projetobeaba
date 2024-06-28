document.addEventListener('DOMContentLoaded', function() {
    const id = getParametroUrl('id')
    console.log(id)

    fetch(`/api/modulos/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar modulo: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        carregarDados(data);
    })
    .catch(error => {
        console.error('Erro ao carregar modulo:', error);
        alert('Não foi possível carregar o modulo.');
    });
});


async function carregarDados(modulo){
    document.getElementById("tagInput").value = modulo.tagModulo;
    document.getElementById("nomeInput").value = modulo.nomeModulo;
    document.getElementById("descricaoInput").value = modulo.descricaoModulo;
    const transacaoSelect = document.getElementById("transacaoSelect");
    
    await criarOpcoesPerfil(transacaoSelect, modulo.idTransacao);

    console.log("Transações carregadas")

    async function criarOpcoesPerfil(transacaoSelect, selectedTransacaoId){
        try {
            const response = await fetch('/api/transacoes');
            if (!response.ok) {
                throw new Error('Falha ao carregar transações: ' + response.statusText);
            }
            const transacoes = await response.json();
            transacoes.forEach(transacao => {
                const option = document.createElement('option');
                option.value = transacao.idTransacao;
                option.textContent = transacao.nomeTransacao;
                if (transacao.idTransacao === selectedTransacaoId) {
                    option.selected = true;
                }
                transacaoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar perfis:', error);
            alert('Não foi possível carregar os perfis.');
        }
    };
};

document.getElementById('edicao-modulo-button').addEventListener('click', function(event){
    event.preventDefault()

    const idModulo = getParametroUrl('id')

    const tagModulo = document.getElementById("tagInput").value;
    const nomeModulo = document.getElementById("nomeInput").value;
    const descricaoModulo = document.getElementById("descricaoInput").value;
    const idTransacao = document.getElementById("transacaoSelect").value;

    const tagUpperCase = tagModulo.toUpperCase();
    const nomeUpperCase = nomeModulo.toUpperCase();

    let transacaoValor = "";

    if(idTransacao === ""){
        transacaoValor = null
    }
    else{
        transacaoValor = idTransacao
    }

    moduloData = {
        tagModulo: tagUpperCase,
        nomeModulo: nomeUpperCase,
        descricaoModulo: descricaoModulo,
        idTransacao: transacaoValor
    };

    console.log('Dados: ' + moduloData)

    fetch(`/api/modulos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduloData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Módulo editado com sucesso");
            //window.location.assign('/modulos/gerenciamento');
        } else {
            alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });

    const idFuncoes = document.getElementById("funcaoSelect").value;

    if(idFuncoes === ""){
        window.location.assign('/modulos/gerenciamento');
    } else {
        associarModuloFuncao();
    }
})

async function associarModuloFuncao(){
    const moduloId = getParametroUrl('id')
    const funcoesAssociadas = await carregarAssociacoesExistentes(moduloId);
    let funcoesAceitas = [];
    let funcoesRecusadas = [];

    const selectedOptions = document.getElementById('funcaoSelect').selectedOptions;
    const funcoesIds = Array.from(selectedOptions).map(option => parseInt(option.value, 10));

    console.log({ transacaoId, funcoesIds }); // Confirme que os dados estão corretos

    const funcoesAssociadasIds = new Set(funcoesAssociadas.map(funcao => funcao.idFuncao));

    funcoesIds.forEach((funcaoid) => {
        if (!funcoesAssociadasIds.has(funcaoid)) {
            funcoesAceitas.push(funcaoid);
        } else {
            funcoesRecusadas.push(funcaoid);
        }
    });

    console.log({ funcoesAceitas, funcoesRecusadas });

    if (funcoesAceitas.length > 0) {
        try {
            // Use Promise.all para fazer todas as requisições de uma vez
            await Promise.all(funcoesAceitas.map(async (funcaoId) => {
                console.log(`Associando função ${funcaoId} à transação ${moduloId}`);

                const response = await fetch(`/api/modulos/${moduloId}/funcoes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idFuncao: funcaoId })
                });

                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);
                }

                const data = await response.json();
                console.log('Success:', data);
                window.location.assign('/associacoes/moduloFuncao')
            }));

            alert('Todas as funções foram associadas com sucesso');
        } catch (error) {
            console.error('Error:', error);
            alert('Falha ao associar: ' + error.message);
        }
    } else {
        alert('Todas as funções selecionadas já estão cadastradas');
    }
}

async function carregarAssociacoesExistentes(idModulo) {
    try {
        const response = await fetch(`/api/modulos/${idModulo}/funcoes`);
        if (!response.ok) {
            throw new Error('Falha ao carregar funções: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar funções associadas à transação');
        return [];
    }
}

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    modulos[valor] = {
        name: undefined,
        funcoes: undefined,
        transacoes: undefined
    }

    localStorage.setItem('modulos', JSON.stringify(modulos));

    exibirMensagem("Módulo excluido com sucesso")
    window.location.assign('../gerenciamento/gerenciamentoModulos.html');
});

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
};