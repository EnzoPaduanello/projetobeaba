document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('cadastroFuncaoForm')
 
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nomeFuncao = document.getElementById('nomeInput').value;
        const descricaoFuncao = document.getElementById('descricaoInput').value;

        const funcaoData = {
            nomeFuncao: nomeFuncao,
            descricaoFuncao: descricaoFuncao
        };

        console.log('Dados do registro da função: ', funcaoData);

        fetch('/api/funcoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcaoData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if(data.success){
                alert('Função cadastrada com sucesso!')
                //window.location.href = '../gerenciamentoFuncao'
            } else {
                alert('Falha no cadastro da função: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro: ', error)
            alert('Falha no cadastro da função: ' + data.message);
        })
    });

});