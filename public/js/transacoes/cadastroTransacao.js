const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

document.getElementById("cadastroTransacaoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("nameInput").value;
    const nameUpperCase = name.toUpperCase();

    const descricao = document.getElementById("descricaoInput").value;

    if (name === "" || descricao === ""){
        exibirMensagem("Preencha todos os campos")
    }
    else{
        const transacao = {
            name: nameUpperCase,
            descricao: descricao.toUpperCase()
        };

        transacoes.push(transacao);

        localStorage.setItem('transacoes', JSON.stringify(transacoes))

        document.getElementById("nameInput").value = "";
        document.getElementById("descricaoInput").value = "";

        exibirMensagem("Transação cadastrada com sucesso")
        console.log(localStorage)

        window.location.assign('../gerenciamento/gerenciamentoTransacoes.html')
    }
});

function exibirMensagem(mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
    setTimeout(() => {
        mensagemDiv.textContent = "";
    }, 3000); 
}

console.log(localStorage)