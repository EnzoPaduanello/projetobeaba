document.addEventListener('DOMContentLoaded', function() {
    const id = getParametroUrl('id')
    console.log(id)

    fetch(`/api/transacoes/${id}`)
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

    const id = getParametroUrl('id')

    fetch(`/api/transacoes/${id}`, {
        method: 'PUT',
        headers: {
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
            //window.location.href = '/transacoes/gerenciamento'; // Redirecionar para a tela de login ou homepage após o sucesso
        } else {
            alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });

    document.getElementById("tagInput").value = "";
    document.getElementById("nomeInput").value = "";
    document.getElementById("descricaoInput").value = "";
    
    const funcoes = document.getElementById("funcaoSelect").value;

    if (funcoes === ""){
        
    } else {
        associarTransacaoFuncao();
    }
})

function carregarDados(transacao){
    document.getElementById("tagInput").value = transacao.tagTransacao;
    document.getElementById("nomeInput").value = transacao.nomeTransacao;
    document.getElementById("descricaoInput").value = transacao.descricaoTransacao;

    const funcaoSelect = document.getElementById("funcaoSelect");
    fetch('/api/funcoes')
    .then(response => response.json())
    .then(data => {
        data.forEach(funcao => {
            let option = new Option(`${funcao.tagFuncao} - ${funcao.nomeFuncao}`, funcao.idFuncao);
            funcaoSelect.add(option);
        });
    });
}

function associarTransacaoFuncao(){
    const transacaoId = getParametroUrl('id');
    const selectedOptions = document.getElementById('funcaoSelect').selectedOptions;
    const funcoesIds = Array.from(selectedOptions).map(option => option.value);

    console.log({ transacaoId, funcoesIds }); // Confirme que os dados estão corretos

    fetch(`/api/transacoes/${transacaoId}/funcoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idFuncao })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert('Associação realizada com sucesso!');
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Falha ao associar: ' + error.message);
    });
}

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

});

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
}