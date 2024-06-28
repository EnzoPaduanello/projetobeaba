document.addEventListener('DOMContentLoaded', function() {
    const id = getParametroUrl('id')
    console.log(id)

    fetch(`/api/usuarios/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar usuario: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        carregarDados(data);
    })
    .catch(error => {
        console.error('Erro ao carregar usuario:', error);
        alert('Não foi possível carregar o usuario.');
    });
});

async function carregarDados(usuario){
    document.getElementById("matriculaInput").value = usuario.matricula;
    document.getElementById("nomeInput").value = usuario.username;
    document.getElementById("emailInput").value = usuario.email;
    document.getElementById("passwordInput").value = usuario.password;
    const perfilSelect = document.getElementById("dadosSelect");

    await criarOpcoesPerfil(perfilSelect, usuario.idPerfil);
    
    console.log('Perfis carregados');

    async function criarOpcoesPerfil(perfilSelect, selectedPerfilId){
        try {
            const response = await fetch('/api/perfis');
            if (!response.ok) {
                throw new Error('Falha ao carregar perfis: ' + response.statusText);
            }
            const perfis = await response.json();
            perfis.forEach(perfil => {
                const option = document.createElement('option');
                option.value = perfil.idPerfil;
                option.textContent = perfil.nomePerfil;
                if (perfil.idPerfil === selectedPerfilId) {
                    option.selected = true;
                }
                perfilSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar perfis:', error);
            alert('Não foi possível carregar os perfis.');
        }
    };
}


function criarOpcoesPerfil(){
    // Carrega os perfis e adiciona ao select
    fetch('/api/perfis')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar perfis: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const perfilSelect = document.getElementById('dadosSelect');
        data.forEach(perfil => {
            let option = new Option(perfil.nomePerfil, perfil.idPerfil); // nomePerfil como texto, idPerfil como valor
            perfilSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar perfis:', error);
        alert('Não foi possível carregar os perfis.');
    });
};

document.getElementById('edicao-usuario-button').addEventListener('click', function(event) {
    event.preventDefault();
    const idUsuario = getParametroUrl('id')

    const matricula = document.getElementById("matriculaInput").value;
    const nome = document.getElementById("nomeInput").value;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const perfil = document.getElementById("dadosSelect").value;

    const nomeUpperCase = nome.toUpperCase();

    let perfilValor = "";

    if(perfil === ""){
        perfilValor = null
    }
    else{
        perfilValor = perfil
    }

    const usuarioData = {
        username: nomeUpperCase,
        email: email,
        password: password,
        matricula: matricula,
        idPerfil: perfilValor
    };

    fetch(`/api/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Usuário editado com sucesso')
            window.location.assign('/usuarios/gerenciamento');
        } else {
            alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    }); 
})

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    usuarios[valor] = {
        matricula: undefined,
        name: undefined,
        email: undefined,
        password: undefined,
        perfil: undefined
    };

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    window.location.assign('../gerenciamento/gerenciamentoUsuarios.html');
});

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
};