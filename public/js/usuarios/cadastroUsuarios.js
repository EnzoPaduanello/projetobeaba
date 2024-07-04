document.addEventListener('DOMContentLoaded', function() {
    //checkAuth();

    const form = document.getElementById("cadastroUsuarioForm")

    criarOpcoesPerfil();

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const matricula = document.getElementById("matriculaInput").value;
        const nome = document.getElementById("nomeInput").value;
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;
        const perfil = document.getElementById("perfilSelect").value;

        const nomeUpperCase = nome.toUpperCase();

        let perfilValor

        if (perfil === ""){
            perfilValor = null
        } else {
            perfilValor = perfil
        }

        const usuarioData = {
            username: nomeUpperCase,
            email: email,
            password: password,
            matricula: matricula,
            idPerfil: perfilValor
        };

        console.log('Dados do registro:', usuarioData);

        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioData)
            });

            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }

            const data = await response.json();

            if (data.success) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = '/usuarios/gerenciamento'; // Redirecionar para a tela de login ou homepage após o sucesso
            } else {
                alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
        }

            document.getElementById("matriculaInput").value = "";
            document.getElementById("nameInput").value = "";
            document.getElementById("emailInput").value = "";
            document.getElementById("passwordInput").value = "";   
        })
});

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
        const perfilSelect = document.getElementById('perfilSelect');
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
