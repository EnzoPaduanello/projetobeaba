const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

function getParametroUrl(name) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(name);
}

const valor = getParametroUrl('valor')
console.log(valor)


function preencherCampos(){
    document.getElementById("matriculaInput").value = usuarios[valor].matricula;
    document.getElementById("nameInput").value = usuarios[valor].name;
    document.getElementById("emailInput").value = usuarios[valor].email;
    document.getElementById("passwordInput").value = usuarios[valor].password;
    

    const perfil = JSON.parse(localStorage.getItem('perfis'));
    const selectElement = document.getElementById("perfil-options");
    criarOpcoesPerfil(selectElement, perfil)

    document.getElementById("perfil-options").value = usuarios[valor].perfil;
}

function criarOpcoesPerfil(select, options){
    if (options !== null){
        options.forEach(option => {
            if (option.name !== undefined){
                const opt = document.createElement('option');
                opt.value = option.name;
                opt.textContent = option.name;
                select.appendChild(opt);
            }
        });
    }
    else{
        console.log("Nenhum perfil encontrado")
    }
};

document.getElementById('edicao-usuario-button').addEventListener('click', function(event) {
    event.preventDefault();

    const matricula = document.getElementById("matriculaInput").value;
    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const perfil = document.getElementById("perfil-options").value;

    const nameUpperCase = name.toUpperCase();

    let perfilValor = "";

    if(perfil === ""){
        perfilValor = null
    }
    else{
        perfilValor = perfil
    }

    
    usuarios[valor] = {
        matricula: matricula,
        name: nameUpperCase,
        email: email,
        password: password,
        perfil: perfilValor
    };

    localStorage.removeItem('usuarios')
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    document.getElementById("matriculaInput").value = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    document.getElementById("passwordInput").value = "";

    exibirMensagem("Usuário editado com sucesso");
    console.log(localStorage);
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

    exibirMensagem("Usuário excluido com sucesso")
    window.location.assign('../gerenciamento/gerenciamentoUsuarios.html');
});

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
    setTimeout(() => {
        mensagemDiv.textContent = "";
    }, 3000); 
};

console.log(usuarios)
preencherCampos()
