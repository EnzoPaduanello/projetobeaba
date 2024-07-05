const token = localStorage.getItem('tokenAuth');

document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        $('.dadosSelect').select2({
            placeholder: "Selecione as funções"
        });
    });
    
    const id = getParametroUrl('id')
    console.log(id)

    fetch(`/api/transacoes/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar transação: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        carregarDados(data);
    })
    .catch(error => {
        console.error('Erro ao carregar transação:', error);
        alert('Não foi possível carregar a transação.');
    });
});

document.getElementById('edicao-transacao-button').addEventListener('click', function(event){
    event.preventDefault()

    const confirmed = confirm('Tem certeza que deseja editar esta transação?');
        if (confirmed) {
            const tagTransacao = document.getElementById("tagInput").value;
            const nomeTransacao = document.getElementById("nomeInput").value;
            const descricaoTransacao = document.getElementById("descricaoInput").value;

            const nomeUpperCase = nomeTransacao.toUpperCase();
            const tagUpperCase = tagTransacao.toUpperCase();

            transacaoData = {
                tagTransacao: tagUpperCase,
                nomeTransacao: nomeUpperCase,
                descricaoTransacao: descricaoTransacao
            };

            console.log('Dados do registro:', transacaoData);

            const idTransacao = getParametroUrl('id')

            fetch(`/api/transacoes/${idTransacao}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transacaoData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Transação editada com sucesso");
                    window.location.href = '/transacoes/gerenciamento'; // Redirecionar para a tela de login ou homepage após o sucesso
                } else {
                    alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
            });
            
            const funcoes = document.getElementById("funcaoSelect").value;

            if (funcoes === ""){
                window.location.assign('/transacoes/gerenciamento')
            } else {
                associarTransacaoFuncao();
            }
        };
});

function carregarDados(transacao){
    document.getElementById("tagInput").value = transacao.tagTransacao;
    document.getElementById("nomeInput").value = transacao.nomeTransacao;
    document.getElementById("descricaoInput").value = transacao.descricaoTransacao;

    const funcaoSelect = document.getElementById("funcaoSelect");
    fetch('/api/funcoes', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(funcao => {
            let option = new Option(`${funcao.tagFuncao} - ${funcao.nomeFuncao}`, funcao.idFuncao);
            funcaoSelect.add(option);
        });
    });
}

async function associarTransacaoFuncao() {
    const transacaoId = parseInt(getParametroUrl('id'), 10);
    const funcoesAssociadas = await carregarAssociacoesExistentes(transacaoId);
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
                console.log(`Associando função ${funcaoId} à transação ${transacaoId}`);

                const response = await fetch(`/api/transacoes/${transacaoId}/funcoes`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ idFuncao: funcaoId })
                });

                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);
                }

                const data = await response.json();
                console.log('Success:', data);
                window.location.assign('/associacoes/transacaoFuncao')
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

async function carregarAssociacoesExistentes(idTransacao) {
    try {
        const response = await fetch(`/api/transacoes/${idTransacao}/funcoes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Falha ao carregar funções: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar funções associadas à funções');
        return []; // Retorne um array vazio em caso de erro para evitar problemas de leitura
    };
};


document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();
    
    const id = getParametroUrl('id')

    const confirmed = confirm('Tem certeza que deseja excluir esta transação?');
        if (confirmed) {
            fetch(`/api/transacoes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Transação excluida com sucesso");
                    window.location.assign('/transacoes/gerenciamento');
                } else {
                    alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Verifique se a transação tem associações vinculadas a ela! Se sim, exclua-as e tente novamente!')
                alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
            });
        };  
});

document.getElementById('ver-associacao-button').addEventListener('click', function(event){
    event.preventDefault();

    const id = getParametroUrl('id');
    window.location.assign('/associacoes/transacaoFuncao?id=' + id)
})

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
};