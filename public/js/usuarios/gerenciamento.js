document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/usuarios')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar usuários: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        criarListaUsuarios(data);
    })
    .catch(error => {
        console.error('Erro ao carregar usuários:', error);
        alert('Não foi possível carregar os usuários.');
    });

    document.getElementById('cadastrar-usuario').addEventListener('click', function(event) {
        event.preventDefault();
        
        window.location.assign('/usuarios/cadastro');
    });

    document.getElementById('pesquisa-button').addEventListener('click', function(event){
        event.preventDefault();

        const filtro = document.getElementById("pesquisa-input").value;

        window.location.assign('/usuarios/gerenciamento?nome=' + filtro);
    })
});

function criarListaUsuarios(usuarios) {
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    usuarios.forEach(usuario => {
        const aElement = document.createElement('a')
        aElement.href = '/usuarios/edicao?id=' + usuario.idUsuario

        const ulElement = document.createElement('ul');
        ulElement.id = usuario.idUsuario;
        ulElement.className = 'dados-list';

        const lMatricula = document.createElement('li');
        const lNome = document.createElement('li');
        const lEmail = document.createElement('li');
        const lPerfil = document.createElement('li');

        lMatricula.textContent = 'Matrícula: ' + usuario.matricula;
        lNome.textContent = 'Nome: ' + usuario.username;
        lEmail.textContent = 'Email: ' + usuario.email;

        if(usuario.idPerfil === null){
            lPerfil.textContent = `Perfis: Nenhum perfil cadastrada no modulo.`
        }
        
        else{
            lPerfil.textContent = 'Perfis: ' + usuario.idPerfil
        }

        ulElement.appendChild(lMatricula);
        ulElement.appendChild(lNome);
        ulElement.appendChild(lEmail);
        ulElement.appendChild(lPerfil);
        aElement.appendChild(ulElement)

        divLista.appendChild(aElement); 
    });
};