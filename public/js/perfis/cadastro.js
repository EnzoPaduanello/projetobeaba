document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("cadastroPerfilForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("nomeInput").value;
        const descricao = document.getElementById("descricaoInput").value;

        const nameUpperCase = name.toUpperCase();

        const perfilData = {
            nomePerfil: nameUpperCase,
            descricaoPerfil: descricao
        };

        console.log('Dados do registro:', perfilData);

        fetch('/api/perfis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(perfilData)
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
    });
});