const token = localStorage.getItem('tokenAuth');

document.addEventListener('DOMContentLoaded', function(){
    let modulos;

    fetch('/api/modulos', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar módulos: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        modulos = data
        criarListaModulos(modulos);
    })
    .catch(error => {
        console.error('Erro ao carregar módulos:', error);
        alert('Não foi possível carregar os módulos.');
    });

    // Evento de clique no botão de pesquisa
    document.getElementById('pesquisa-button').addEventListener('click', function(event) {
        event.preventDefault();

        const pesquisa = document.getElementById('pesquisa-input').value;
        const pesquisaUpperCase = pesquisa.toUpperCase();

        if (pesquisaUpperCase === '') {
            criarListaModulos(modulos); // Mostra todos os usuários se a pesquisa estiver vazia
        } else {
            const modulosFiltrados = modulos.filter(modulo => 
                modulo.nomeModulo.toUpperCase() === pesquisaUpperCase ||
                modulo.tagModulo.toUpperCase() === pesquisaUpperCase
            );
            criarListaModulos(modulosFiltrados); // Mostra os usuários filtrados pela pesquisa
        }
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
        const lDescricao = document.createElement('li');
        const lTransacoes = document.createElement('li');

        lTag. textContent = 'Tag: ' + modulo.tagModulo
        lNome.textContent = 'Nome: ' + modulo.nomeModulo;
        lDescricao.textContent = 'Descrição: ' + modulo.descricaoModulo;

        if(modulo.idTransacao === null){
            lTransacoes.textContent = `Transação: Nenhuma transação cadastrada no modulo.`
        }
        
        else{
            associarTransacoes(lTransacoes, modulo)
        }

        ulElement.appendChild(lTag);
        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);
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
            modulo.nomeModulo === pesquisaUpperCase ||
            modulo.tagModulo === pesquisaUpperCase
        );
        criarListaModulos(modulosFiltrados);
    }
});

document.getElementById('cadastrar-modulo').addEventListener('click', function(event){
    event.preventDefault()

    window.location.assign('/modulos/cadastro')
})

async function associarTransacoes(lTransacao, modulo){
    try {
        const response = await fetch('/api/transacoes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Falha ao carregar transacoes: ' + response.statusText);
        }
        const transacoes = await response.json();
        transacoes.forEach(transacao => {
            if(modulo.idTransacao === transacao.idTransacao){
                lTransacao.textContent = 'Transação: ' + transacao.nomeTransacao
            }
        });
    } catch (error) {
        console.error('Erro ao carregar transacoes:', error);
        alert('Não foi possível carregar os transacoes.');
    }
}