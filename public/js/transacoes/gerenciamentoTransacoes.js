document.addEventListener('DOMContentLoaded', function() {
    let transacoes;

    fetch('/api/transacoes')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar transações: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        transacoes = data
        criarListaTransacoes(transacoes);
    })
    .catch(error => {
        console.error('Erro ao carregar transações:', error);
        alert('Não foi possível carregar as transações.');
    });

    document.getElementById('cadastrar-transacao').addEventListener('click', function(event) {
        event.preventDefault();
        
        window.location.assign('/transacoes/cadastro');
    });

    // Evento de clique no botão de pesquisa
    document.getElementById('pesquisa-button').addEventListener('click', function(event) {
        event.preventDefault();

        const pesquisa = document.getElementById('pesquisa-input').value;
        const pesquisaUpperCase = pesquisa.toUpperCase();

        if (pesquisaUpperCase === '') {
            criarListaTransacoes(transacoes); // Mostra todos os usuários se a pesquisa estiver vazia
        } else {
            const transacoesFiltrados = transacoes.filter(transacao => 
                transacao.nomeTransacao.toUpperCase() === pesquisaUpperCase ||
                transacao.tagTransacao.toUpperCase() === pesquisaUpperCase
            );
            criarListaTransacoes(transacoesFiltrados); // Mostra os usuários filtrados pela pesquisa
        }
    });
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
        ulElement.className = 'dados-list';

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