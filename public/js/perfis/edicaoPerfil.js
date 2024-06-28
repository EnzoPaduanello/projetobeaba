document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        $('.dadosSelect').select2({
            placeholder: "Selecione as funções"
        });
    });

    const id = getParametroUrl('id')
    console.log(id)

    fetch(`/api/perfis/${id}`)
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
    fetch('/api/modulos')
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
    const id = getParametroUrl('id')

    const nomePerfil = document.getElementById('nomeInput').value;
    const nomeUpperCase = nomePerfil.toUpperCase();

    const descricaoPerfil = document.getElementById('descricaoInput').value;

    perfilData = {
        nomePerfil: nomeUpperCase,
        descricaoPerfil: descricaoPerfil
    }

    console.log('Dados: ' + perfilData)

    fetch(`/api/perfis/${id}`, {
        method: 'PUT',
        headers: {
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
            window.location.assign('/perfis/gerenciamento');
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
})

async function carregarAssociacoesExistentes(idPerfil) {
    try {
        const response = await fetch(`/api/perfis/${idPerfil}/modulos`);
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

    const selectedOptions = document.getElementById('funcaoSelect').selectedOptions;
    const modulosIds = Array.from(selectedOptions).map(option => parseInt(option.value, 10));

    console.log({ perfilId, modulosIds }); // Confirme que os dados estão corretos

    const modulosAssociadosIds = new Set(modulosAssociados.map(funcao => funcao.idFuncao));

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
            // Use Promise.all para fazer todas as requisições de uma vez
            await Promise.all(modulosAceitos.map(async (moduloId) => {
                console.log(`Associando função ${moduloId} à perfil ${perfilId}`);

                const response = await fetch(`/api/transacoes/${perfilId}/funcoes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idFuncao: moduloId })
                });

                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);
                }

                const data = await response.json();
                console.log('Success:', data);
                window.location.assign('/associacoes/perfilModulo')
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

    perfis[valor] = {
        nome: undefined,
        modulos: undefined
    }

    localStorage.setItem('perfis', JSON.stringify(perfis));

    exibirMensagem("Perfil excluido com sucesso")
    window.location.assign('../gerenciamento/gerenciamentoPerfis.html');
});

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
};