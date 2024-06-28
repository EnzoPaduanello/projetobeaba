document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/perfis')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar funções: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        criarListaPerfis(data);
    })
    .catch(error => {
        console.error('Erro ao carregar funções:', error);
        alert('Não foi possível carregar os funções.');
    });
});

function criarListaPerfis(perfis) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    perfis.forEach((perfil) => {
        const aElement = document.createElement('a')
        aElement.href = `/perfis/edicao?id=${perfil.idPerfil}`

        const ulElement = document.createElement('ul');
        ulElement.id = perfil.idPerfil;
        ulElement.className = 'dados-list';

        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');

        lNome.textContent = 'Nome: ' + perfil.nomePerfil;
        lDescricao.textContent = 'Descrição: ' + perfil.descricaoPerfil;

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
        criarListaPerfis(perfis);
    } else {
        const perfisFiltrados = perfis.filter(perfil => 
            perfil.name === pesquisaUpperCase || 
            (perfil.modulos && perfil.modulos.includes(pesquisaUpperCase))
        );
        criarListaPerfis(perfisFiltrados);
    }
});


document.getElementById('cadastrar-perfil').addEventListener('click', function(event) {
    event.preventDefault();
    
    window.location.assign('../cadastro/cadastroPerfis.html');
});
