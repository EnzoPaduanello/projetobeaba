document.addEventListener('DOMContentLoaded', function() {
    //checkAuth();

    const form = document.getElementById("cadastroFuncaoForm")

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const tagFuncao = document.getElementById("tagInput").value;
        const nomeFuncao = document.getElementById("nomeInput").value;
        const descricaoFuncao = document.getElementById("descricaoInput").value;

        const tagUpperCase = tagFuncao.toUpperCase();
        const nameUpperCase = nomeFuncao.toUpperCase();

        const funcaoData = {
            tagFuncao: tagUpperCase,
            nomeFuncao: nameUpperCase,
            descricaoFuncao: descricaoFuncao,
        };

        console.log('Dados do registro:', funcaoData);

        fetch('/api/funcoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcaoData)
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
                window.location.href = '/funcoes/gerenciamento'; // Redirecionar para a tela de login ou homepage após o sucesso
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
