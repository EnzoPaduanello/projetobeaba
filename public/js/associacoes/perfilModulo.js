const token = localStorage.getItem('tokenAuth');

document.addEventListener('DOMContentLoaded', function() {
    //Obtendo o id pelo url da pagina
    const idPerfil = parseInt(getParametroUrl('id'), 10);

    //Criando o título da página
    fetch(`/api/perfis/${idPerfil}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar nome do perfil: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const titulo = document.getElementById('titulo-lista')
        titulo.textContent = `Lista de associações de ${data.nomePerfil}`
    })
    .catch(error => {
        console.error('Erro ao carregar perfil:', error);
        alert('Não foi possível carregar o perfil.');
    });

    //Carregando os dados das listas
    try {
        fetch(`/api/perfis/${idPerfil}/modulos`, {
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
            criarListas(data)
        })
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar funções associadas à funções');
    };
});

function criarListas(modulos){
    const idPerfil = getParametroUrl('id');
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    modulos.forEach(modulo => {
        const aElement = document.createElement('a')
        aElement.href = '/modulos/edicao?id=' + modulo.idModulo

        const ulElement = document.createElement('ul');
        ulElement.id = modulo.idModulo;
        ulElement.className = 'dados-list';

        const lTag = document.createElement('li');
        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');
        
        lTag.textContent = 'Tag: ' + modulo.tagModulo
        lNome.textContent = 'Nome: ' + modulo.nomeModulo;
        lDescricao.textContent = 'Descrição: ' + modulo.descricaoModulo

        // Criação do botão de exclusão com imagem
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        const deleteImg = document.createElement('img');
        deleteImg.src = '/img/icon-exclusao-100.png';  // Substitua pelo caminho da sua imagem
        deleteImg.alt = 'Delete';
        deleteButton.appendChild(deleteImg);

        let perfilModulo
        
        fetch(`/api/perfis/${idPerfil}/modulos/${modulo.idModulo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar nome da perfil: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            perfilModulo = data
        })
        .catch(error => {
            console.error('Erro ao carregar perfil:', error);
            alert('Não foi possível carregar a perfil.');
        });

        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();

            console.log(perfilModulo.idPerfilModulo)
            const confirmed = confirm('Tem certeza que deseja excluir esta função?');
            if (confirmed) {
                try {
                    const response = await fetch(`/api/perfis/${perfilModulo.idPerfilModulo}/modulos`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        ulElement.remove();
                    } else {
                        alert('Erro ao excluir a associação.');
                    }
                } catch (error) {
                    console.error('Erro ao excluir a associação:', error);
                    alert('Erro ao excluir a associação.');
                }
            }
        });

        ulElement.appendChild(lTag);
        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);
        ulElement.appendChild(deleteButton)

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}

document.getElementById('cadastrarAssociacao').addEventListener('click', function (event) {
    event.preventDefault();
    const idPerfil = getParametroUrl('id');

    window.location.assign('/perfis/edicao?id='+idPerfil)
})

document.getElementById('gerenciarPerfil').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.assign('/perfis/gerenciamento')
})

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
}