document.addEventListener('DOMContentLoaded', function(){
    fetch('/api/modulos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar módulos: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        criarListaModulos(data);
    })
    .catch(error => {
        console.error('Erro ao carregar módulos:', error);
        alert('Não foi possível carregar os módulos.');
    });
});

function criarListaModulos(modulos) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    modulos.forEach((modulo) => {
        const aElement = document.createElement('a')
        aElement.href = `/modulos/edicao?id=${modulo.idModulo}`

        const ulElement = document.createElement('ul');
        ulElement.id = modulo.idModulo;
        ulElement.className = 'dados-list';

        const lTag = document.createElement('li');
        const lNome = document.createElement('li');
        const lTransacoes = document.createElement('li');

        lTag. textContent = 'Tag: ' + modulo.tagModulo
        lNome.textContent = 'Nome: ' + modulo.nomeModulo;

        if(modulo.idTransacao === null){
            lTransacoes.textContent = `Transações: Nenhuma transação cadastrada no modulo.`
        }
        
        else{
            lTransacoes.textContent = 'Transações: ' + modulo.idTransacao
        }

        ulElement.appendChild(lTag)
        ulElement.appendChild(lNome);
        ulElement.appendChild(lTransacoes);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}

document.getElementById('pesquisa-button').addEventListener('click', function(event) {
    event.preventDefault();
    
    const pesquisa = document.getElementById('pesquisa-input').value;
    const pesquisaUpperCase = pesquisa.toUpperCase();

    if (pesquisaUpperCase === '') {
        criarListaModulos(modulos);
    } else {
        const modulosFiltrados = modulos.filter(modulo => 
            modulo.name === pesquisaUpperCase || 
            (modulo.transacoes && modulo.transacoes.includes(pesquisaUpperCase)) || 
            (modulo.funcoes && modulo.funcoes.includes(pesquisaUpperCase))
        );
        criarListaModulos(modulosFiltrados);
    }
});


document.getElementById('cadastrar-modulo').addEventListener('click', function(event){
    event.preventDefault()

    window.location.assign('/modulos/cadastro')
})