const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
console.log(usuarios)

document.getElementById('recuperarForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('emailInput').value.trim();
    const matricula = document.getElementById('matriculaInput').value.trim();

    // Filtrar usuários válidos que têm email, matrícula e senha
    const usuariosValidos = usuarios.filter(usuario => usuario && usuario.email && usuario.matricula && usuario.password);

    // Encontrar usuário correspondente
    const usuarioEncontrado = usuariosValidos.find(usuario => {
        return usuario.email.trim().toUpperCase() === email.toUpperCase() && usuario.matricula.trim() === matricula;
    });

    console.log(usuarioEncontrado)

    // Verificar se o usuário foi encontrado e exibir a senha
    if (usuarioEncontrado) {
        exibirMensagem(`Senha: ${usuarioEncontrado.password}`);
    } else {
        exibirMensagem('Email ou matrícula inválidos.');
    }
});

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = mensagem;
}

