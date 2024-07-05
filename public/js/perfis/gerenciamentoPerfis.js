const token = localStorage.getItem('tokenAuth');

document.addEventListener('DOMContentLoaded', function() {
    let perfis;

    fetch('/api/perfis', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar funções: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        perfis = data
        criarListaPerfis(perfis);
    })
    .catch(error => {
        console.error('Erro ao carregar funções:', error);
        alert('Não foi possível carregar os funções.');
    });

    // Evento de clique no botão de pesquisa
    document.getElementById('pesquisa-button').addEventListener('click', function(event) {
        event.preventDefault();

        const pesquisa = document.getElementById('pesquisa-input').value;
        const pesquisaUpperCase = pesquisa.toUpperCase();

        if (pesquisaUpperCase === '') {
            criarListaPerfis(perfis); // Mostra todos os usuários se a pesquisa estiver vazia
        } else {
            const perfisFiltrados = perfis.filter(perfil => 
                perfil.nomePerfil.toUpperCase() === pesquisaUpperCase
            );
            criarListaPerfis(perfisFiltrados); // Mostra os usuários filtrados pela pesquisa
        }
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

document.getElementById('cadastrar-perfil').addEventListener('click', function(event) {
    event.preventDefault();
    
    window.location.assign('/perfis/cadastro');
});
