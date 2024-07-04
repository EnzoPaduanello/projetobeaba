document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("cadastroTransacaoForm")

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const tagTransacao = document.getElementById("tagInput").value;
        const nomeTransacao = document.getElementById("nomeInput").value;
        const descricaoTransacao = document.getElementById("descricaoInput").value;

        const tagUpperCase = tagTransacao.toUpperCase();
        const nameUpperCase = nomeTransacao.toUpperCase();

        const transacaoData = {
            tagTransacao: tagUpperCase,
            nomeTransacao: nameUpperCase,
            descricaoTransacao: descricaoTransacao
        };

        console.log('Dados do registro:', transacaoData);

        fetch('/api/transacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transacaoData)
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
                window.location.href = '/transacoes/gerenciamento'; // Redirecionar para a tela de login ou homepage após o sucesso
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
    })
});