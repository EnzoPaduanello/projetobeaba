document.addEventListener('DOMContentLoaded', function(){
    fetch('/api/funcoes')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar usuários: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        criarListaFuncoes(data)
    })
    .catch(error => {
        console.error('Erro ao carregar usuários:', error);
        alert('Não foi possível carregar os usuários.');
    });
});

function criarListaFuncoes(funcoes) {
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    funcoes.forEach((funcao) => {
        
        const aElement = document.createElement('a')
        aElement.href = '/funcoes/edicao?id=' + funcao.idFuncao

        const ulElement = document.createElement('ul');
        ulElement.id = funcao.idFuncao;
        ulElement.className = 'dados-list';

        const lTag = document.createElement('li');
        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');
        
        lTag.textContent = 'Tag: ' + funcao.tagFuncao
        lNome.textContent = 'Nome: ' + funcao.nomeFuncao;
        lDescricao.textContent = 'Descrição: ' + funcao.descricaoFuncao

        ulElement.appendChild(lTag);
        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}

document.getElementById('pesquisa-button').addEventListener('click', function(event) {
    event.preventDefault();
    
    const pesquisa = document.getElementById('pesquisa-input').value;
    const pesquisaUpperCase = pesquisa.toUpperCase();

    if (pesquisaUpperCase === '') {
        criarListaFuncoes(funcoes);
    } else {
        const funcoesFiltrados = funcoes.filter(funcao => funcao.name === pesquisaUpperCase || (funcao.descricao && funcao.descricao.toUpperCase() == pesquisaUpperCase));
        criarListaFuncoes(funcoesFiltrados);
    }
});

document.getElementById('cadastrar-funcao').addEventListener('click', function(event) {
    event.preventDefault();
    
    window.location.assign('/funcoes/cadastro');
});