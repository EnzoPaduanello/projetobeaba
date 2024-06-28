document.addEventListener('DOMContentLoaded', function() {
    const id = getParametroUrl('id')
    console.log(id)

    fetch(`/api/funcoes/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar função: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        carregarDados(data);
    })
    .catch(error => {
        console.error('Erro ao carregar função:', error);
        alert('Não foi possível carregar a função.');
    });
});


document.getElementById('edicao-funcao-button').addEventListener('click', function(event){
    event.preventDefault()

    const id = getParametroUrl('id')

    const tagFuncao = document.getElementById("tagInput").value;
    const tagUpperCase = tagFuncao.toUpperCase();

    const nomeFuncao = document.getElementById("nomeInput").value;
    const nomeUpperCase = nomeFuncao.toUpperCase();

    const descricaoFuncao = document.getElementById("descricaoInput").value;

    funcaoData = {
        tagFuncao: tagUpperCase,
        nomeFuncao: nomeUpperCase,
        descricaoFuncao: descricaoFuncao
    };

    console.log('Dados: ' + funcaoData)

    fetch(`/api/funcoes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcaoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Função editada com sucesso");
            window.location.assign('/funcoes/gerenciamento');
        } else {
            alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
})

function carregarDados(funcao){
    document.getElementById("tagInput").value = funcao.tagFuncao;
    document.getElementById("nomeInput").value = funcao.nomeFuncao;
    document.getElementById("descricaoInput").value = funcao.descricaoFuncao;
}

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    funcoes[valor] = {
        name: undefined,
        descricao: undefined
    }

    localStorage.setItem('funcoes', JSON.stringify(funcoes));

    
    window.location.assign('../gerenciamento/gerenciamentoFuncoes.html');
});

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
};