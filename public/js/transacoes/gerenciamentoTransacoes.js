const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

function criarListaTransacoes(transacoes) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    transacoes.forEach((transacao, i) => {
        if (transacao.name === undefined || transacao.descricao === undefined){

        }else{
            const aElement = document.createElement('a')
            aElement.href = '../edicao/edicaoTransacao.html?valor=' + i

            const ulElement = document.createElement('ul');
            ulElement.id = i;
            ulElement.className = 'transacao-list';

            const lNome = document.createElement('li');
            const lDescricao = document.createElement('li');

            lNome.textContent = 'Nome: ' + transacao.name;
            lDescricao.textContent = 'Descrição: ' + transacao.descricao.toUpperCase();

            ulElement.appendChild(lNome);
            ulElement.appendChild(lDescricao);

            aElement.appendChild(ulElement)

            divLista.appendChild(aElement);
        }
        
    });
}

document.getElementById('pesquisa-button').addEventListener('click', function(event) {
    event.preventDefault();
    
    const pesquisa = document.getElementById('pesquisa-input').value;
    const pesquisaUpperCase = pesquisa.toUpperCase();

    if (pesquisaUpperCase === '') {
        criarListaTransacoes(transacoes);
    } else {
        const transacoesFiltrados = transacoes.filter(transacao => 
            transacao.name === pesquisaUpperCase || 
            (transacao.descricao && transacao.descricao.toUpperCase() === pesquisaUpperCase)
        );
        criarListaTransacoes(transacoesFiltrados);
    }
});


document.getElementById('cadastrar-transacao').addEventListener('click', function(event) {
    event.preventDefault();
    
    window.location.assign('../cadastro/cadastroTransacoes.html');
});

criarListaTransacoes(transacoes);
console.log(transacoes)