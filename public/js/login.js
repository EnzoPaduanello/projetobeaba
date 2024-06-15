const usuarios = JSON.parse(localStorage.getItem('usuarios'));

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('loginInput').value;
    const password = document.getElementById('senhaInput').value;

    document.getElementById('loginInput').value = '';
    document.getElementById('senhaInput').value = '';

    if(usuarios){
        const usuariosValidos = usuarios.filter(usuario => usuario && usuario.name && usuario.password);

        const usuarioEncontrado = usuariosValidos.find(usuario => {
            return usuario.name.toUpperCase() === name.toUpperCase() && usuario.password === password;
        });
    
        if (usuarioEncontrado) {
            window.location.assign('main.html');
        } else {
            exibirMensagem('Usuário ou senha incorretos.');
        }
    }
    else{
        exibirMensagem('Nenhum usuário cadastrado na base de dados.')
    }
});

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = mensagem;
}

console.log(usuarios)