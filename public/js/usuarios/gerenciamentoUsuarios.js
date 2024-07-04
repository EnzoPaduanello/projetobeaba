document.addEventListener('DOMContentLoaded', function() {
    let usuarios; 

    // Carrega os usuários ao carregar a página
    fetch('/api/usuarios')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar usuários: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        usuarios = data; // Atribui os dados à variável global
        criarListaUsuarios(usuarios); // Cria a lista inicial de usuários
    })
    .catch(error => {
        console.error('Erro ao carregar usuários:', error);
        alert('Não foi possível carregar os usuários.');
    });

    // Evento de clique no botão de cadastro de usuário
    document.getElementById('cadastrar-usuario').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.assign('/usuarios/cadastro');
    });

    // Evento de clique no botão de pesquisa
    document.getElementById('pesquisa-button').addEventListener('click', function(event) {
        event.preventDefault();

        const pesquisa = document.getElementById('pesquisa-input').value;
        const pesquisaUpperCase = pesquisa.toUpperCase();

        if (pesquisaUpperCase === '') {
            criarListaUsuarios(usuarios); // Mostra todos os usuários se a pesquisa estiver vazia
        } else {
            const usuariosFiltrados = usuarios.filter(usuario => 
                usuario.username.toUpperCase() === pesquisaUpperCase || 
                usuario.matricula.toString() === pesquisaUpperCase
            );
            criarListaUsuarios(usuariosFiltrados); // Mostra os usuários filtrados pela pesquisa
        }
    });
});

function criarListaUsuarios(usuarios) {
    const divLista = document.getElementById('list-div');

    // Limpa a lista existente
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    // Cria um elemento para cada usuário
    usuarios.forEach(usuario => {
        const aElement = document.createElement('a');
        aElement.href = '/usuarios/edicao?id=' + usuario.idUsuario;

        const ulElement = document.createElement('ul');
        ulElement.id = usuario.idUsuario;
        ulElement.className = 'dados-list';

        const lMatricula = document.createElement('li');
        lMatricula.textContent = 'Matrícula: ' + usuario.matricula;

        const lNome = document.createElement('li');
        lNome.textContent = 'Nome: ' + usuario.username;

        const lEmail = document.createElement('li');
        lEmail.textContent = 'Email: ' + usuario.email;

        const lPerfil = document.createElement('li');
        if (usuario.idPerfil === null) {
            lPerfil.textContent = 'Perfis: Nenhum perfil cadastrado';
        } else {
            lPerfil.textContent = 'Perfis: ' + usuario.idPerfil;
        }

        ulElement.appendChild(lMatricula);
        ulElement.appendChild(lNome);
        ulElement.appendChild(lEmail);
        ulElement.appendChild(lPerfil);

        aElement.appendChild(ulElement);
        divLista.appendChild(aElement);
    });
}
