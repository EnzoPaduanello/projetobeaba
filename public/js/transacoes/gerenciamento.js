document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/transacoes')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar transações: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        criarListaTransacoes(data);
    })
    .catch(error => {
        console.error('Erro ao carregar transações:', error);
        alert('Não foi possível carregar as transações.');
    });

    document.getElementById('cadastrar-transacao').addEventListener('click', function(event) {
        event.preventDefault();
        
        window.location.assign('/transacoes/cadastro');
    });

    document.getElementById('pesquisa-button').addEventListener('click', function(event){
        event.preventDefault();

        const filtro = document.getElementById("pesquisa-input").value;

        window.location.assign('/transacoes/gerenciamento?nome=' + filtro);
    })
});

function criarListaTransacoes(transacoes) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    transacoes.forEach((transacao) => {
        const aElement = document.createElement('a')
        aElement.href = `/transacoes/edicao?id=${transacao.idTransacao}` 

        const ulElement = document.createElement('ul');
        ulElement.id = transacao.idTransacao;
        ulElement.className = 'transacao-list';

        const lTag = document.createElement('li');
        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');

        lTag.textContent = 'Tag: ' + transacao.tagTransacao
        lNome.textContent = 'Nome: ' + transacao.nomeTransacao;
        lDescricao.textContent = 'Descrição: ' + transacao.descricaoTransacao;

        ulElement.appendChild(lTag);
        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}