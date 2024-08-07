const token = localStorage.getItem('tokenAuth');

document.addEventListener('DOMContentLoaded', function() {
    //Obtendo o id pelo url da pagina
    const idTransacao = parseInt(getParametroUrl('id'), 10);

    //Criando o título da página
    fetch(`/api/transacoes/${idTransacao}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar nome da transação: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const titulo = document.getElementById('titulo-lista')
        titulo.textContent = `Lista de associações de ${data.nomeTransacao} (${data.tagTransacao})`
    })
    .catch(error => {
        console.error('Erro ao carregar transação:', error);
        alert('Não foi possível carregar a transação.');
    });

    //Carregando os dados das listas
    try {
        fetch(`/api/transacoes/${idTransacao}/funcoes`, {
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

function criarListas(funcoes){
    const idTransacao = getParametroUrl('id');
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    funcoes.forEach(funcao => {
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

        // Criação do botão de exclusão com imagem
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        const deleteImg = document.createElement('img');
        deleteImg.src = '/img/icon-exclusao-100.png';  // Substitua pelo caminho da sua imagem
        deleteImg.alt = 'Delete';
        deleteButton.appendChild(deleteImg);

        let transacaoFuncao
        
        fetch(`/api/transacoes/${idTransacao}/funcoes/${funcao.idFuncao}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar nome da transação: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            transacaoFuncao = data
        })
        .catch(error => {
            console.error('Erro ao carregar transação:', error);
            alert('Não foi possível carregar a transação.');
        });

        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();

            const confirmed = confirm('Tem certeza que deseja excluir esta função?');
            if (confirmed) {
                try {
                    const response = await fetch(`/api/transacoes/${transacaoFuncao.idTransacaoFuncao}/funcoes` , {
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
    const id = getParametroUrl('id')
    window.location.assign('/transacoes/edicao?id='+id)
})

document.getElementById('gerenciarTransacao').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.assign('/transacoes/gerenciamento')
})

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
}