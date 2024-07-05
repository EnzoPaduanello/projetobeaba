const token = localStorage.getItem('tokenAuth');

document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        $('.dadosSelect').select2({
            placeholder: "Selecione os módulos"
        });
    });

    const id = getParametroUrl('id')
    console.log(id)

    fetch(`/api/perfis/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar perfil: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        carregarDados(data);
    })
    .catch(error => {
        console.error('Erro ao carregar perfil:', error);
        alert('Não foi possível carregar a perfil.');
    });
});

function carregarDados(perfil){
    document.getElementById("nomeInput").value = perfil.nomePerfil;
    document.getElementById("descricaoInput").value = perfil.descricaoPerfil;

    const moduloSelect = document.getElementById("moduloSelect");
    fetch('/api/modulos', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(modulo => {
            let option = new Option(`${modulo.tagModulo} - ${modulo.nomeModulo}`, modulo.idModulo);
            moduloSelect.add(option);
        });
    });
}

document.getElementById('edicao-perfil-button').addEventListener('click', function(event){
    event.preventDefault();

    const confirmed = confirm('Tem certeza que deseja editar este perfil?');
        if (confirmed) {
            const idPerfil = getParametroUrl('id')

            const nomePerfil = document.getElementById('nomeInput').value;
            const nomeUpperCase = nomePerfil.toUpperCase();

            const descricaoPerfil = document.getElementById('descricaoInput').value;

            perfilData = {
                nomePerfil: nomeUpperCase,
                descricaoPerfil: descricaoPerfil
            }

            console.log('Dados: ' + perfilData)

            fetch(`/api/perfis/${idPerfil}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(perfilData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Perfil editado com sucesso')
                } else {
                    alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
            }); 

            const modulos = document.getElementById("moduloSelect").value;

            if (modulos === ""){
                window.location.assign('/perfis/gerenciamento')
            } else {
                associarPerfilModulo();
            }
        };
});

async function carregarAssociacoesExistentes(idPerfil) {
    try {
        const response = await fetch(`/api/perfis/${idPerfil}/modulos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Falha ao carregar funções: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar funções associadas à funções');
        return []; // Retorne um array vazio em caso de erro para evitar problemas de leitura
    };
};

async function associarPerfilModulo() {
    const perfilId = parseInt(getParametroUrl('id'), 10);
    const modulosAssociados = await carregarAssociacoesExistentes(perfilId);
    let modulosAceitos = [];
    let modulosRecusados = [];

    const selectedOptions = document.getElementById('moduloSelect').selectedOptions;
    const modulosIds = Array.from(selectedOptions).map(option => parseInt(option.value, 10));

    console.log({ perfilId, modulosIds }); // Confirme que os dados estão corretos

    const modulosAssociadosIds = new Set(modulosAssociados.map(modulo => modulo.idModulo));

    modulosIds.forEach((moduloId) => {
        if (!modulosAssociadosIds.has(moduloId)) {
            modulosAceitos.push(moduloId);
        } else {
            modulosRecusados.push(moduloId);
        }
    });

    console.log({ modulosAceitos, modulosRecusados });

    if (modulosAceitos.length > 0) {
        try {
            await Promise.all(modulosAceitos.map(async (moduloId) => {
                console.log(`Associando função ${moduloId} ao módulo ${perfilId}`);

                const response = await fetch(`/api/perfis/${perfilId}/modulos`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ idModulo: moduloId })
                });

                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);
                }

                const data = await response.json();
                console.log('Success:', data);
                window.location.assign('/associacoes/perfilModulo?id='+perfilId)
            }));

            alert('Todas as funções foram associadas com sucesso');
        } catch (error) {
            console.error('Error:', error);
            alert('Falha ao associar: ' + error.message);
        }
    } else {
        alert('Todas as funções selecionadas já estão cadastradas');
    }    
}

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();
    
    const id = getParametroUrl('id')

    const confirmed = confirm('Tem certeza que deseja excluir este perfil?');
        if (confirmed) {
            fetch(`/api/perfis/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Perfil excluido com sucesso");
                    window.location.assign('/perfis/gerenciamento');
                } else {
                    alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Verifique se o perfil tem associações vinculadas a ele! Se sim, exclua-as e tente novamente!')
                alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
            });
        };  
});

document.getElementById('ver-associacao-button').addEventListener('click', function(event){
    event.preventDefault();

    const id = getParametroUrl('id');
    window.location.assign('/associacoes/perfilModulo?id=' + id)
})

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
};