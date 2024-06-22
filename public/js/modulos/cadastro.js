document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("cadastroModuloForm")

    criarOpcoesTransacoes();

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const tag = document.getElementById("tagInput").value;
        const nome = document.getElementById("nomeInput").value;
        const descricao = document.getElementById("descricaoInput").value;
        const transacao = document.getElementById("transacaoSelect").value;

        const tagUpperCase = tag.toUpperCase();
        const nomeUpperCase = nome.toUpperCase();

        let transacaoValor = "";

        if(transacao === ""){
            transacaoValor = null
        }
        else{
            transacaoValor = transacao
        }

        const moduloData = {
            tagModulo: tagUpperCase,
            nomeModulo: nomeUpperCase,
            descricaoModulo: descricao,
            idTransacao: transacaoValor
        };

        console.log('Dados do registro:', moduloData);

        fetch('/api/modulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moduloData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = '/'; // Redirecionar para a tela de login ou homepage após o sucesso
            } else {
                alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
        });

        document.getElementById("nomeInput").value = "";
        document.getElementById("descricaoInput").value = "";
        document.getElementById("transacaoSelect").value = "";
    });
});

function criarOpcoesTransacoes(){
    // Carrega os perfis e adiciona ao select
    fetch('/api/transacoes')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar transações: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const transacaoSelect = document.getElementById('transacaoSelect');
        data.forEach(transacao => {
            let option = new Option(`${transacao.tagTransacao} - ${transacao.nomeTransacao}`, transacao.idTransacao); // nomeTransacao como texto, idTransacao como valor
            transacaoSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar transações:', error);
        alert('Não foi possível carregar os transações.');
    });
};
