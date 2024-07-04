document.addEventListener('DOMContentLoaded', function() {
    let senhaUsuario = ''


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
    
    const confirmed = confirm('Tem certeza que deseja editar este usuário?');
        if (confirmed) {
            const idUsuario = getParametroUrl('id')

            const matricula = document.getElementById("matriculaInput").value;
            const nome = document.getElementById("nomeInput").value;
            const email = document.getElementById("emailInput").value;
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
        };
})

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    const id = getParametroUrl('id')

    const confirmed = confirm('Tem certeza que deseja excluir este usuário?');
        if (confirmed) {
            fetch(`/api/usuarios/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Usuário excluido com sucesso");
                    window.location.assign('/usuarios/gerenciamento');
                } else {
                    alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Verifique se o usuário tem associações vinculadas a ele! Se sim, exclua-as e tente novamente!')
                alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
            });
        }; 
});

function getParametroUrl(id) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(id);
};