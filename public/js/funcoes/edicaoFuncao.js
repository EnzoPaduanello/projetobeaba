const funcoes = JSON.parse(localStorage.getItem('funcoes')) || [];

function getParametroUrl(name) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(name);
}

const valor = getParametroUrl('valor')
console.log(valor)
console.log(funcoes)


document.getElementById('edicao-funcao-button').addEventListener('click', function(event){
    event.preventDefault()

    const name = document.getElementById("nameInput").value;
    const nameUpperCase = name.toUpperCase();

    const descricao = document.getElementById("descricaoInput").value;

    if (name === "" || descricao === ""){
        exibirMensagem("Preencha todos os campos")
    }
    else{

        funcoes[valor] = {
            name: nameUpperCase,
            descricao: descricao
        };

        localStorage.setItem('funcoes', JSON.stringify(funcoes))

        document.getElementById("nameInput").value = "";
        document.getElementById("descricaoInput").value = "";

        exibirMensagem("Função editada com sucesso")
        console.log(localStorage)

        window.location.assign('../gerenciamento/gerenciamentoFuncoes.html');
    }
})

function preencherCampos(){
    document.getElementById("nameInput").value = funcoes[valor].name;
    document.getElementById("descricaoInput").value = funcoes[valor].descricao;
}

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    funcoes[valor] = {
        name: undefined,
        descricao: undefined
    }

    localStorage.setItem('funcoes', JSON.stringify(funcoes));

    exibirMensagem("Função excluida com sucesso")
    window.location.assign('../gerenciamento/gerenciamentoFuncoes.html');
});

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
    setTimeout(() => {
        mensagemDiv.textContent = "";
    }, 3000); 
};

preencherCampos()