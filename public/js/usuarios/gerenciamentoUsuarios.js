const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

function criarListaUsuarios(usuarios) {
    const divLista = document.getElementById('list-div');
    
    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    usuarios.forEach((usuario, i) => {
        if (usuario.name === undefined || usuario.matricula === undefined || usuario.email === undefined || usuario.password === undefined){

        }else{
            const aElement = document.createElement('a')
            aElement.href = '../edicao/edicaoUsuario.html?valor=' + i

            const ulElement = document.createElement('ul');
            ulElement.id = usuario.matricula;
            ulElement.className = 'user-list';

            const lMatricula = document.createElement('li');
            const lNome = document.createElement('li');
            const lEmail = document.createElement('li');
            const lSenha = document.createElement('li');
            const lPerfil = document.createElement('li');

            lMatricula.textContent = 'Matrícula: ' + usuario.matricula;
            lNome.textContent = 'Nome: ' + usuario.name;
            lEmail.textContent = 'Email: ' + usuario.email;
            lSenha.textContent = 'Senha: ' + usuario.password;
            lPerfil.textContent = 'Perfil: ' + usuario.perfil;

            ulElement.appendChild(lMatricula);
            ulElement.appendChild(lNome);
            ulElement.appendChild(lEmail);
            ulElement.appendChild(lSenha);
            ulElement.appendChild(lPerfil);
            aElement.appendChild(ulElement)

            divLista.appendChild(aElement);
        }
        
    });
}

document.getElementById('pesquisa-button').addEventListener('click', function(event) {
    event.preventDefault();
    
    const pesquisa = document.getElementById('pesquisa-input').value;
    const pesquisaUpperCase = pesquisa.toUpperCase();

    if (pesquisaUpperCase === '') {
        criarListaUsuarios(usuarios);
    } else {
        const usuariosFiltrados = usuarios.filter(usuario => usuario.name === pesquisaUpperCase || usuario.matricula === pesquisaUpperCase);
        criarListaUsuarios(usuariosFiltrados);
    }
});

document.getElementById('cadastrar-usuario').addEventListener('click', function(event) {
    event.preventDefault();
    
    window.location.assign('../cadastro/cadastroUsuarios.html');
});

criarListaUsuarios(usuarios);
console.log(usuarios)