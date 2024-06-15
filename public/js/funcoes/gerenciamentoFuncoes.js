const funcoes = JSON.parse(localStorage.getItem('funcoes')) || [];

function criarListaFuncoes(funcoes) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    funcoes.forEach((funcao, i) => {
        if (funcao.name === undefined || funcao.descricao === undefined){

        }else{
            const aElement = document.createElement('a')
            aElement.href = '../edicao/edicaoFuncao.html?valor=' + i

            const ulElement = document.createElement('ul');
            ulElement.id = i;
            ulElement.className = 'funcao-list';

            const lNome = document.createElement('li');
            const lDescricao = document.createElement('li');

            lNome.textContent = 'Nome: ' + funcao.name;
            lDescricao.textContent = 'Descrição: ' + funcao.descricao.toUpperCase();

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
        criarListaFuncoes(funcoes);
    } else {
        const funcoesFiltrados = funcoes.filter(funcao => funcao.name === pesquisaUpperCase || (funcao.descricao && funcao.descricao.toUpperCase() == pesquisaUpperCase));
        criarListaFuncoes(funcoesFiltrados);
    }
});

document.getElementById('cadastrar-funcao').addEventListener('click', function(event) {
    event.preventDefault();
    
    window.location.assign('../cadastro/cadastroFuncoes.html');
});

criarListaFuncoes(funcoes);
console.log(funcoes)