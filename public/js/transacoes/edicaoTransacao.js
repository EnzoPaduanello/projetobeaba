const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

function getParametroUrl(name) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(name);
}

const valor = getParametroUrl('valor')
console.log(valor)
console.log(transacoes)


document.getElementById('edicao-transacao-button').addEventListener('click', function(event){
    event.preventDefault()

    const name = document.getElementById("nameInput").value;
    const nameUpperCase = name.toUpperCase();

    const descricao = document.getElementById("descricaoInput").value;

    if (name === "" || descricao === ""){
        exibirMensagem("Preencha todos os campos")
    }
    else{

        transacoes[valor] = {
            name: nameUpperCase,
            descricao: descricao
        };

        localStorage.setItem('transacoes', JSON.stringify(transacoes))

        document.getElementById("nameInput").value = "";
        document.getElementById("descricaoInput").value = "";

        exibirMensagem("Transação cadastrada com sucesso")
        console.log(localStorage)

        window.location.assign('../gerenciamento/gerenciamentoTransacoes.html');
    }
})

function preencherCampos(){
    document.getElementById("nameInput").value = transacoes[valor].name;
    document.getElementById("descricaoInput").value = transacoes[valor].descricao;
}

document.getElementById('exclusao-button').addEventListener('click', function(event){
    event.preventDefault();

    transacoes[valor] = {
        name: undefined,
        descricao: undefined
    }

    localStorage.setItem('transacoes', JSON.stringify(transacoes));

    exibirMensagem("Transação excluida com sucesso")
    window.location.assign('../gerenciamento/gerenciamentoTransacoes.html');
});

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
    setTimeout(() => {
        mensagemDiv.textContent = "";
    }, 3000); 
};

preencherCampos()